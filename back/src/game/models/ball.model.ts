import { Vector } from './vector.model';
import { Point } from './point.model';
import { Board } from './board.model';

export class Ball {
  public size: number;
  public halfSize: number;
  public speed: number;
  public pos: Point;
  public accelFactor: number;
  public dir: Vector;
  public tRefresh = Date.now();

  constructor(gameBoard: Board) {
    this.size = 20;
    this.halfSize = this.size * 0.5;
    this.speed = 100;
    this.pos = new Point(gameBoard.width * 0.5, gameBoard.height * 0.5);
    // this.pos = new Point(700, 20);
    this.accelFactor = 0.2;
    const randomAngle = Math.random() * (Math.PI / 3) - Math.PI / 6;
    const randomX = Math.random() < 0.5 ? -1 : 1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    // this.dir = new Vector(
    //   Math.cos(randomAngle) * randomX,
    //   Math.sin(randomAngle) * randomY);
    // this.dir = new Vector(0.707, 0.707);
    this.dir = new Vector(1, 0);
  }

  clone(gameBoard: Board): Ball {
    const clonedBall = new Ball(gameBoard);

    clonedBall.size = this.size;
    clonedBall.halfSize = this.halfSize;
    clonedBall.speed = this.speed;
    clonedBall.pos = new Point(this.pos.x, this.pos.y);
    clonedBall.accelFactor = this.accelFactor;
    clonedBall.dir = new Vector(this.dir.x, this.dir.y);
    clonedBall.tRefresh = this.tRefresh;
    return clonedBall;
  }



}
