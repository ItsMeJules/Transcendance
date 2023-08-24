import { IsString, IsNumber } from 'class-validator';

export class LeaveDto {
  @IsString()
  roomName: string;
}
