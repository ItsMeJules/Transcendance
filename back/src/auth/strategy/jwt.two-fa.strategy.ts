import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';
import { UnauthorizedException } from '@nestjs/common';
import { TwoFaEnabledException } from '../exceptions/no-two-fa.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies?.access_token;
        },
      ]),
      secretOrKey: process.env.jwtSecret,
    });
  }

  /* Jwt-2FA strategy validation - error management ok */
  async validate(payload: PayloadDto): Promise<User> {
    const user = await this.prismaService.findUserById(payload.id);
    if (payload.isTwoFactorAuthenticationVerified === true)
      throw new TwoFaEnabledException();
    if (!user)
      throw new UnauthorizedException('User not found');
    delete user.hash;
    return user;
  }
}
