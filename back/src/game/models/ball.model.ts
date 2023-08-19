import { Vector } from './vector.model';
import { Point } from './point.model';
import { Board } from './board.model';

export class Ball {
  // Define ball properties and calculations here
  public size: number;
  public speed: number;
  public pos: Point;
  public accelFactor: number;
  public dir: Vector;

  constructor(gameBoard: Board) {
    this.size = 20;
    this.speed = 10;
    this.pos = new Point(gameBoard.width * 0.5, gameBoard.height * 0.5);
    // this.pos = new Point(700, 20);
    this.accelFactor = 0.2;
    const randomAngle = Math.random() * (Math.PI / 3) - Math.PI / 6;
    const randomX = Math.random() < 0.5 ? -1 : 1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    // this.dir = new Vector(
    //   Math.cos(randomAngle) * randomX,
    //   Math.sin(randomAngle) * randomY);
    this.dir = new Vector(1, 0);
  }
}
