import { Vector } from './vector.model';
import { Point } from './point.model';
import { GameBoard } from './gameboard.model';

export class Ball {
  // Define ball properties and calculations here
  public size: number;
  public speed: number;
  public pos: Point;
  public accelarationFactor: number;
  public dir: Vector;

  constructor(gameBoard: GameBoard) {
    this.size = 20;
    this.speed = 2;
    this.pos = new Point(gameBoard.width * 0.5, gameBoard.height * 0.5);
    this.accelarationFactor = 0.2;
    const randomAngle = Math.random() * (Math.PI / 3) - Math.PI / 6;
    const randomX = Math.random() < 0.5 ? -1 : 1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * randomX,
      Math.sin(randomAngle) * randomY);
  }
}
