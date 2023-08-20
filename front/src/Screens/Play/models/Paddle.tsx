import { Board } from "./Board";

export class Paddle {
  public width: number;
  public height: number;
  public speed: number;
  public pos: number;

  constructor(gameBoard: Board) {
    this.width = gameBoard.width * 15 / 600;
    this.height = gameBoard.height * 80 / 300;
    this.speed = gameBoard.height * 10 / 300;
    this.pos = gameBoard.height * 0.5 - this.height * 0.5;
  }

  refactorPaddle(factor: number) {
    this.width = this.width * factor;
    this.height = this.height * factor;
    this.speed = this.speed * factor;
    this.pos = this.pos * factor;
  }

  resetPaddleTop(gameBoard: Board) {
    this.pos = gameBoard.height * 0.5 - this.height * 0.5;
  }

  updatePad(incomingPad: Paddle) {
    this.pos = incomingPad.pos;
    this.speed = incomingPad.speed;
  }
}