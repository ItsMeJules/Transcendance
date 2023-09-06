import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFaService {
  constructor(private prismaService: PrismaService) { }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ): boolean {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  /* Generate 2FA secret - error management ok */
  public async generateTwoFactorAuthenticationSecret(user: User) {
    try {
      const secret = authenticator.generateSecret();

      const otpAuthUrl = authenticator.keyuri(
        user.email,
        'salut petit correcteur',
        secret,
      );

      await this.prismaService.setTwoFactorAuthenticationSecret(secret, user.id);

      return {
        secret,
        otpAuthUrl,
      };
    } catch (error) {
      throw (error);
    }
  }

  /* Generate QR code + URL */
  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }
}
