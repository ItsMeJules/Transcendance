import { IsString, IsNumber } from 'class-validator';

export class KickDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;
}
