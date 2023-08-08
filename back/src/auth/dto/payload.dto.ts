import { IsBoolean, IsInt } from 'class-validator';

export class PayloadDto {
  @IsInt()
  id: number;

  @IsBoolean()
  isTwoFactorAuthenticationVerified: boolean;
}
