import { Injectable, Res, HttpStatus, BadRequestException } from '@nestjs/common';
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
      callbackURL: `http://${process.env.LOCAL_IP}:8000/api/auth/42/redirect`,
    });
  }

  /* 42 OAuth strategy validation - error management ok */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User | null> {
    try {
      const user = await this.prismaService.findOrCreateUserOAuth({
        username: profile._json.login,
        firstName: profile._json.first_name,
        lastName: profile._json.last_name,
        email: profile._json.email,
        profilePicture: profile._json.image.link,
        hash: '',
      });
      // Uncomment to force a user with a 42 or google mail that has a password
      // to sign in via the form instead of bypassing the password via OAuth
      // if (user.hash !== '')
      //   throw new BadRequestException('Password needed, please sign in via the form');
      return user;
    } catch (error) {
      throw (error);
    }
  }
}
