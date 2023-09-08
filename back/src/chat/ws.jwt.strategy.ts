import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { TwoFactorException } from 'src/auth/exceptions/two-factor.exception';
import * as jwt from 'jsonwebtoken';
import handlePrismaError from '@utils/prisma.error';
import { extractAccessTokenFromCookie } from '@utils/utils';

interface JwtPayload {
  id: number;
  isTwoFactorAuthenticationVerified: boolean;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = extractAccessTokenFromCookie(client);
    let user;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = jwt.verify(token, process.env.jwtSecret);
      if (
        typeof payload === 'object' &&
        'id' in payload &&
        'isTwoFactorAuthenticationVerified' in payload
      ) {
        await this.validate(payload as JwtPayload);
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Attaching user to data for future reference if needed
      context.switchToWs().getData().user = user;

      return true;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw err;
      }
    }
  }

  async validate(payload: {
    id: number;
    isTwoFactorAuthenticationVerified: boolean;
  }): Promise<User | { status: string }> {
    const user = await this.prismaService.findUserById(payload.id);
    if (!user) throw new BadRequestException('Bad token!!!!!');
    if (
      user.isTwoFactorAuthenticationEnabled &&
      !payload.isTwoFactorAuthenticationVerified
    )
      throw new TwoFactorException();
    delete user.hash;
    return user;
  }
}
