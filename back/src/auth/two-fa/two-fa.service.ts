import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFaService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
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

    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

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
