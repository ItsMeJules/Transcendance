import { IsString, IsNumber } from 'class-validator';

export class BanDto {
  @IsNumber()
  targetId: number;

  @IsString()
  roomName: string;
}
