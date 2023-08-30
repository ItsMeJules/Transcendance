import { Board } from "./Board";
import { Point } from "./point";
import { initGameConfig } from "../init/game.properties";

export class Paddle {
  public width!: number;
  public height!: number;
  public wallGap!: number;
  public speed!: number;
  public pos!: Point;

  constructor(board: Board, player: number) {
    this.standardInitializer(board, player);
  }

  standardInitializer(board: Board, player: number) {
    this.width = 0;
    this.height = 0;
    this.wallGap = initGameConfig.pad.wallGap * board.scaleFactor;
    this.speed = initGameConfig.pad.speed * board.scaleFactor;
    if (player === 1)
      this.pos = new Point(
        this.wallGap,
        (board.height - this.height) * 0.5);
    else
      this.pos = new Point(
        board.width - this.wallGap - this.width,
        (board.height - this.height) * 0.5);
  }

  refactorPaddle(factor: number) {
    this.width = this.width * factor;
    this.height = this.height * factor;
    this.speed = this.speed * factor;
    this.pos.x = this.pos.x * factor;
    this.pos.y = this.pos.y * factor;
  }

  resetPaddleTop(board: Board) {
    this.pos.x = (board.height - this.height) * 0.5;
  }

  updatePad(board: Board, incomingPad: Paddle) {
    this.width = incomingPad.width * board.scaleFactor;
    this.height = incomingPad.height * board.scaleFactor;
    this.speed = incomingPad.speed * board.scaleFactor;
    this.pos.x = incomingPad.pos.x * board.scaleFactor;
    this.pos.y = incomingPad.pos.y * board.scaleFactor;
  }
}