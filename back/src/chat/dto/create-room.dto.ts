import { IsNotEmpty, IsString } from 'class-validator';
import { Server } from 'socket.io';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsString()
  password?: string;

  server: Server;
}
