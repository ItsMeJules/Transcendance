import { IsString, IsNumber } from 'class-validator';

export class PromoteDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;
}
