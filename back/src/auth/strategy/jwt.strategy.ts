import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { TwoFactorException } from '../exceptions/two-factor.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService,
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

  async validate(payload: {
    id: number;
    isTwoFactorAuthenticationVerified: boolean;
  }): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('User not found');
    }

    if (
      user.isTwoFactorAuthenticationEnabled &&
      !payload.isTwoFactorAuthenticationVerified
    ) {
      console.log('2FA verification required');
      throw new TwoFactorException();
    }

    delete user.hash;
    return user;
  }
}
