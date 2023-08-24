import { IsString, IsNumber } from 'class-validator';

export class InviteDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;
}
