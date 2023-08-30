import { IsString, IsNumber } from 'class-validator';

export class MuteDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;
}
