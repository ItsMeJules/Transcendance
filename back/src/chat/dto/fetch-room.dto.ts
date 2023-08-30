import { IsString } from 'class-validator';
import { Server } from 'socket.io';

export class FetchRoomDto {
  @IsString()
  roomName: string;

  server: Server;
}
