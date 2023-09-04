import { IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class InviteToPlayDto {
  @IsNumber()
  targetId: number;

  server: Server;
}
