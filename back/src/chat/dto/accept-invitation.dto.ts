import { IsNumber } from 'class-validator';
import { Server } from 'socket.io';

export class AcceptInvitationDto {
  @IsNumber()
  targetId: number;

  server: Server;
}
