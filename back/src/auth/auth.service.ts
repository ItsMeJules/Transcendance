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
import { ConfigService } from '@nestjs/config';
import { PayloadDto } from './dto/payload.dto';
import { AuthDtoUp } from './dto/authup.dto';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async login(user: any): Promise<string> {
    const payload: PayloadDto = {
      id: user.id,
      isTwoFactorAuthenticationVerified: false,
    };
    console.log('before sign');
    const token = this.jwtService.sign(payload);
    console.log('after sign');
    return token;
  }

  async signup(dto: AuthDtoUp) {
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

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      id: userId,
      email,
    };
    const secret = 'mySuperSecretKey';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '120m',
      secret: secret,
    });
    return token;
  }

  async validateJwtToken(token: string): Promise<User | any | null> {
    try {
      const jwtSecret = process.env.jwtSecret;
      const decodedToken: any = jwt.verify(token, jwtSecret);
      const { id } = decodedToken;
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

  async connectUserToAllPublicRooms(userId: number): Promise<void> {
    console.log(`Connecting user ${userId} to all public rooms...`);
    try {
      const publicRooms = await this.prisma.room.findMany({
        where: {
          type: 'PUBLIC',
        },
      });

      const updates = publicRooms.map((room) => {
        return this.prisma.room.update({
          where: { id: room.id },
          data: {
            users: {
              connect: {
                id: userId,
              },
            },
          },
        });
      });

      await Promise.all(updates);

      console.log(`User ${userId} connected to all public rooms.`);
    } catch (e) {
      console.log(e);
    }
  }
}
