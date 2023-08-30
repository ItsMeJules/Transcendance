import { Board } from "./board.model";
import { Paddle } from "./paddle.model";

export class Player {
  public id: number;
  public status = 'pending';
  public pad: Paddle;
  public score = 0;
  public isMoving = false;
  public movingDir = '';
  public isWinner = false;

  constructor(board: Board, gameMode: number, id: number, player: number) {
    this.id = id;
    if (gameMode === 1)
      this.standardInitializer(board, gameMode, player);
    else if (gameMode ===2)
      this.randomInitializer(board, gameMode, player);
    else
    this.standardInitializer(board, gameMode, player);
  }

  standardInitializer(board: Board, gameMode: number, player: number) {
    this.pad = new Paddle(board, gameMode, player);
  }

  randomInitializer(board: Board, gameMode: number, player: number) {
    this.pad = new Paddle(board, gameMode, player);
  }
}