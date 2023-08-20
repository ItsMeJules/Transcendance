import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SendMsgRoomDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsString()
  clientId: string;

  @IsNumber()
  authorID: number;
}
