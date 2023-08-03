import { IsBoolean, IsInt } from 'class-validator';

export class PayloadDto {
  @IsInt()
  id: number;

  // @IsBoolean()
  // is2FAEnabled: boolean;

  // @IsBoolean()
  // is2FAAuthenticated: boolean;
}
