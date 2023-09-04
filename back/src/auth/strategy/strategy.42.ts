import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Response } from 'express';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(readonly prismaService: PrismaService) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User | null> {
    //promise? <any?> void?
    try {
      const user = await this.prismaService.findOrCreateUserOAuth({
        username: profile._json.login,
        firstName: profile._json.first_name,
        lastName: profile._json.last_name,
        email: profile._json.email,
        profilePicture: profile._json.image.link,
        hash: '',
      });
      return user;
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Google authentication failed', // Provide a meaningful error message
      });
      return null;
    }
  }
}
