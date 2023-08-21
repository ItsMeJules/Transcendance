import { Board } from "./board.model";
import { Paddle } from "./paddle.model";

export class Player {
  public id: number;
  public status = 'pending';
  public pad: Paddle;
  public score = 0;

  constructor(board: Board, initType: string, id: number, player: number) {
    this.id = id;
    if (initType === 'standard')
      this.standardInitializer(board, initType, player);
    this.standardInitializer(board, initType, player);
  }

  standardInitializer(board: Board, initType: string, player: number) {
    this.pad = new Paddle(board, initType, player);
  }
}