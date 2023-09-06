import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFaCodeDto {
  @IsString()
  twoFactorAuthenticationSecret: string;
}
