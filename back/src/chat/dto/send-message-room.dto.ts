import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SendMsgRoomDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsString()
  roomName: string;
}
