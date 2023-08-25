import { IsNotEmpty, IsString } from 'class-validator';
import { Server } from 'socket.io';

export class JoinRoomDto {
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @IsString()
  password: string;

  server: Server;
}
