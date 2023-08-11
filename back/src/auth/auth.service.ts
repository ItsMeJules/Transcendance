import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './dto/payload.dto';
import { AuthDtoUp } from './dto/authup.dto';
import { Response } from 'express';

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

  async signup(dto: AuthDtoUp) {
    const profilePictureUrl = '/images/logo.png';
    const absoluteUrl = process.env.API_BASE_URL + `${profilePictureUrl}`;
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
          friends: {
            // Provide friends as an empty array of nested objects
            create: [],
          },
        },
      });
      return this.login(user);
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
    return this.login(user);
  }
}
