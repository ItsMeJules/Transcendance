import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { Response } from 'express';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(readonly userService: UserService) {
    //readonly / private ?
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL, // change this
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    //promise? <any?> void?
    try {
      const user = await this.userService.findOrCreateUserOAuth({
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
