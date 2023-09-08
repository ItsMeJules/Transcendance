import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { Res, Injectable, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    try {
      const user = await this.prismaService.findOrCreateUserOAuth({
        username: profile._json.name,
        firstName: profile._json.given_name,
        lastName: profile._json.family_name,
        email: profile._json.email,
        profilePicture: profile._json.picture,
        hash: '',
      });
      // Uncomment to force a user with a 42 or google mail that has a password
      // to sign in via the form instead of bypassing the password via OAuth
      // if (user.hash !== '')
      //   throw new BadRequestException('Password needed, please sign in via the form');
      return user;
    } catch (error) {
      throw error;
    }
  }
}
