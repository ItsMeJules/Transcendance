import { IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class RefuseInvitationDto {
  @IsNumber()
  targetId: number;

  server: Server;
}
