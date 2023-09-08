import { Point } from "./point";
import { Board } from "./Board";
import { Vector } from "./vector";

export class Ball {
    public size: number;
    public speed: number;
    public pos: Point;
    public tip: Point;
    public accelFactor: number;
    public dir: Vector;
  
    constructor(board: Board) {
      this.size = 0;
      this.speed = 0;
      this.pos = new Point(0, 0);
      this.tip = new Point(0, 0);
      this.accelFactor = 0;
      this.dir = new Vector(0, 0);
    }
  
    refactorBall(factor: number) {
      this.pos.x = this.pos.x * factor;
      this.pos.y = this.pos.y * factor;
      this.tip.x = this.tip.x * factor;
      this.tip.y = this.tip.y * factor;
      this.size = this.size * factor;
      this.speed = this.speed * factor;
    }

    updateBall(board: Board, ball: Ball) {
      this.pos.updatePoint(board, ball.pos);
      this.dir = ball.dir;
      this.size = ball.size * board.scaleFactor;
      this.speed = ball.speed * board.scaleFactor;
      this.tip.x = this.pos.x - this.size * 0.5;
      this.tip.y = this.pos.y - this.size * 0.5;
    }
  }