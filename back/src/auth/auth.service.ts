import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './dto/payload.dto';
import { AuthDtoUp } from './dto/authup.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

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

  async signup(dto: AuthDtoUp, res: Response) {
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
          profilePicture: process.env.API_BASE_URL + '/images/logo.png',
          friends: {
            create: [],
          },
        },
      });
      return user;
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
      expiresIn: '120m',
      secret: secret,
    });
    return token;
  }

  async validateJwtToken(token: string): Promise<User | null> {
    try {
      const jwtSecret = this.config.get('JWT_SECRET');
      const decodedToken: any = jwt.verify(token, jwtSecret);
      const {id} = decodedToken;
      // console.log('id:', id, ' and email:', email);
      const user = this.prisma.user.findUnique({
        where: { id },
        include: { friends: true },
      });
      return user;
    } catch (err) {
      return null;
    }
  }
}
