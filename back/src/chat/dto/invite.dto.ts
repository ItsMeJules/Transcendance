import { IsString, IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class InviteDto {
  @IsString()
  roomName: string;

  @IsNumber()
  targetId: number;

  server: Server;
}
