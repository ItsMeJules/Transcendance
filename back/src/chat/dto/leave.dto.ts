import { IsString, IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class LeaveDto {
  @IsString()
  roomName: string;

  server: Server;
}
