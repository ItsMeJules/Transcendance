import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFaService {
  constructor(private prismaService: PrismaService) {}

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ): boolean {
    console.log(
      'twoFactorAuthenticationCode :',
      twoFactorAuthenticationCode,
      'user.twoFactorAuthenticationSecret :',
      user.twoFactorAuthenticationSecret,
    );
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  public async generateTwoFactorAuthenticationSecret(user: User) {
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
  }

  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    console.log('otpAuthUrl :', otpAuthUrl);
    console.log('\n :');
    console.log('stream :', stream);
    return toFileStream(stream, otpAuthUrl);
  }
}
