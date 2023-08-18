import { Board } from "./board.model";
export class Paddle {
  // Define paddle properties and calculations here
  public width: number;
  public height: number;
  public speed: number;
  public pos: number;

  constructor(board: Board) {
    this.width = 15;
    this.height = 80;
    this.speed = 10;
    this.pos = board.height * 0.5 - this.height * 0.5;
  }

  resetPaddleTop(board: Board) {
    this.pos = board.height * 0.5 - this.height * 0.5;
  }
}