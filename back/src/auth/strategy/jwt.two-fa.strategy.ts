import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Payload } from '@prisma/client/runtime/library';
import { PayloadDto } from '../dto/payload.dto';
import { UnauthorizedException } from '@nestjs/common';
import { TwoFaEnabledException } from '../exceptions/no-two-fa.exception';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies?.access_token;
        },
      ]),
      secretOrKey: process.env.jwtSecret,
    });
  }

  async validate(payload: PayloadDto) {
    const user = await this.userService.findOneById(payload.id);
    if (payload.isTwoFactorAuthenticationVerified === true) {
      throw new TwoFaEnabledException();
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    delete user.hash;
    return user;
  }
}
