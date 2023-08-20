import { Vector } from './vector.model';
import { Point } from './point.model';
import { Board } from './board.model';
import { Player } from './player.model';

export class Ball {
  public size: number;
  public halfSize: number;
  public speed: number;
  public pos: Point;
  public accelFactor: number;
  public dir: Vector;
  public tRefresh = Date.now();

  constructor(board: Board) {
    this.size = 20;
    this.halfSize = this.size * 0.5;
    this.speed = 200;
    this.pos = new Point(board.width * 0.5, board.height * 0.5);
    this.accelFactor = 0.2;
    const maxAngle = Math.atan((board.height - this.size) / board.width); /// add -paddle.width to board.width
    const randomAngle = Math.random() * maxAngle * 2 - maxAngle;
    const randomX = Math.random() < 0.5 ? -1 : 1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * randomX,
      Math.sin(randomAngle) * randomY);
    this.dir = new Vector(-1, 0);
  }

  clone(board: Board): Ball { 
    const clonedBall = new Ball(board);

    clonedBall.size = this.size;
    clonedBall.halfSize = this.halfSize;
    clonedBall.speed = this.speed;
    clonedBall.pos = new Point(this.pos.x, this.pos.y);
    clonedBall.accelFactor = this.accelFactor;
    clonedBall.dir = new Vector(this.dir.x, this.dir.y);
    clonedBall.tRefresh = this.tRefresh;
    return clonedBall;
  }

  randomService(board: Board, whichPlayerToServe: number) {
    const maxAngle = Math.atan((board.height - this.size) / board.width);
    const randomAngle = Math.random() * maxAngle * 2 - maxAngle;
    const dirX = whichPlayerToServe === 1 ? -1 : 1; 
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * dirX,
      Math.sin(randomAngle) * randomY);
  }


}
