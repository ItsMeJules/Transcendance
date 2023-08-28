import { IsString } from 'class-validator';
import { Server } from 'socket.io';

export class UsersRoomDto {
  @IsString()
  roomName: string;

  server: Server;
}
