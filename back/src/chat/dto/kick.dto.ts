import { IsString, IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class KickDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;

  server: Server;
}
