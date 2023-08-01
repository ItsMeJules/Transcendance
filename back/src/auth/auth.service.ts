import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './dto/payload.dto';
import { AuthDtoUp } from './dto/authup.dto';

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
    };
    return this.jwtService.sign(payload);
  }

  async signup(dto: AuthDtoUp) {
    const profilePictureUrl = '/images/logo.png';
    const absoluteUrl =
      this.config.get('API_BASE_URL') + `${profilePictureUrl}`;
    const hash = await argon.hash(dto.password);
    if (dto.username.length > 100)
      throw new ForbiddenException('Username too long');
    else if (dto.password.length > 100)
      throw new ForbiddenException('Password too long');
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash,
          profilePicture: absoluteUrl,
        },
      });
      const access_token = this.signToken(user.id, user.email);
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Add more errors handlers or a default one?
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
    if (!user || user.hash === '')
      throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      id: userId,
      email,
    };
    const secret = process.env.jwtSecret;
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });
    return token;
  }
}
