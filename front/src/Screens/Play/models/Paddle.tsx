import { Board } from "./Board";

export class Paddle {
  public width: number;
  public height: number;
  public speed: number;
  public pos: number;

  constructor(board: Board) {
    this.width = board.width * 15 / board.gridWidth;
    this.height = board.height * 80 / board.gridHeight;
    this.speed = board.height * 10 / board.gridHeight;
    // this.pos = board.height * 0.5 - this.height * 0.5;
    this.pos = 0;
  }

  refactorPaddle(factor: number) {
    this.width = this.width * factor;
    this.height = this.height * factor;
    this.speed = this.speed * factor;
    this.pos = this.pos * factor;
  }

  resetPaddleTop(board: Board) {
    this.pos = board.height * 0.5 - this.height * 0.5;
  }

  updatePad(board: Board, incomingPad: Paddle) {
    this.width = incomingPad.width * board.scaleFactor;
    this.height = incomingPad.height * board.scaleFactor;
    this.speed = incomingPad.speed * board.scaleFactor;
    this.pos = incomingPad.pos * board.scaleFactor;
  }
}