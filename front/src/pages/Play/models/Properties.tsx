import { Ball } from "./Ball";
import { Board } from "./Board";
import { Player } from "./Player";

export class GameProperties {
  public status = '';
  public isPlaying = false;
  public isEnded = false;
  public isUserWinner = false;
  public tNow = Date.now();
  public tPrev = Date.now();
  public board: Board;
  public ball: Ball;
  public pl1: Player;
  public pl2: Player;

  constructor() {
    this.board = new Board(window.innerWidth * 0.8);
    this.ball = new Ball(this.board);
    this.pl1 = new Player(this.board, 1);
    this.pl2 = new Player(this.board, 2);
  }

}