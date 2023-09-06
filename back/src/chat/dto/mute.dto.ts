import { IsString, IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class MuteDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;

  server: Server;
}
