import { IsString, IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class BanDto {
  @IsNumber()
  targetId: number;

  @IsString()
  roomName: string;

  server: Server;
}
