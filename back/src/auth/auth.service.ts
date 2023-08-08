import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(user: any): Promise<any> {
    const payload: PayloadDto = {
      id: user.id,
      isTwoFactorAuthenticationVerified: false,
    };
    return this.jwtService.sign(payload);
  }

  async signup(dto: AuthDto) {
    const profilePictureUrl = '/images/logo.png';
    const absoluteUrl =
      this.config.get('API_BASE_URL') + `${profilePictureUrl}`;
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          profilePicture: absoluteUrl,
          gamesPlayed: 0,
          gamesWon: 0,
          userPoints: 0,
          userLevel: 1.4,
        },
      });
      return this.login(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this.login(user);
  }
}
