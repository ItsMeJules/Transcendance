import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { TwoFactorException } from '../exceptions/two-factor.exception';
import handlePrismaError from '@utils/prisma.error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          try {
            const token = req.cookies?.access_token;
            if (!token) {
              throw new UnauthorizedException('No token provided');
            }
            return token;
          } catch (error) {
            //
          }
        },
      ]),
      secretOrKey: process.env.jwtSecret,
    });
  }

  /* Jwt strategy validation - error management ok */
  async validate(payload: {
    id: number;
    isTwoFactorAuthenticationVerified: boolean;
  }): Promise<User | { status: string }> {
    const user = await this.prismaService.findUserById(payload.id);
    if (!user) throw new BadRequestException('Bad token');
    if (
      user.isTwoFactorAuthenticationEnabled &&
      !payload.isTwoFactorAuthenticationVerified
    )
      throw new TwoFactorException();
    delete user.hash;
    return user;
  }
}
