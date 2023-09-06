import { IsNumber } from 'class-validator';
import { Socket } from 'socket.io';

export class DualDto {
  @IsNumber()
  player1Id: number;

  @IsNumber()
  player2Id: number;

  socketPlayer1: Socket;
  socketPlayer2: Socket;
}
