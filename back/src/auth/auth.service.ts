import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
  UseGuards,
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
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import handlePrismaError from '@utils/prisma.error';
import handleJwtError from '@utils/jwt.error';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  /* Login - error management ok */
  /* Its actually a sign Tokens function */
  async login(
    user: any,
    isTwoFactorAuthenticationVerified = false,
  ): Promise<any> {
    const payload: PayloadDto = {
      id: user.id,
      isTwoFactorAuthenticationVerified: isTwoFactorAuthenticationVerified,
    };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '90m',
    });

    const refreshPayload = { id: user.id };

    const refresh_token = this.jwtService.sign(refreshPayload, {
      secret: process.env.jwtRefreshSecret, // Ensure a separate secret for refresh tokens
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  /* Signup - error management ok */
  async signup(dto: AuthDtoUp) {
    const hash = await argon.hash(dto.password);
    if (dto.username.length > 100)
      throw new BadRequestException('Username too long');
    else if (dto.password.length > 100)
      throw new BadRequestException('Password too long');
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
      handlePrismaError(error);
    }
  }

  /* Signin - error management ok */
  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user || user.hash === '')
        throw new BadRequestException('Credentials incorrect');
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
      return this.login(user);
    } catch (error) {
      handlePrismaError(error);
      throw error;
    }
  }

  /* Validate JWT token - error management ok */
  async validateJwtToken(
    token: string,
    deleteHash: boolean,
  ): Promise<User | any | null> {
    try {
      const jwtSecret = process.env.jwtSecret;
      const decodedToken: any = jwt.verify(token, jwtSecret);
      const { id } = decodedToken;
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { friends: true },
      });
      if (!user) throw new Error('Problem token');
      if (user && deleteHash) delete user.hash;
      return user;
    } catch (err) {
      // handleJwtError(err);
      handlePrismaError(err);
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<User> {
    try {
      const secret = process.env.jwtRefreshSecret;
      const decodedToken: any = jwt.verify(refreshToken, secret);
      const { id } = decodedToken;
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { friends: true },
      });
      if (!user) throw new UnauthorizedException('User does not exist');

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /* -- CHAT -- */
  /* Connect user to all public rooms - error management ok */
  async connectUserToAllPublicRooms(userId: number): Promise<void> {
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
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
