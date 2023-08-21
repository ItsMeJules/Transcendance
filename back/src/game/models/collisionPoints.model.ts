import { Ball } from "./ball.model";
import { Paddle } from "./paddle.model";
import { Point } from "./point.model";
import { initGameConfig } from "../init/game.properties";
import { initialize } from "passport";

export class CollisionPointsBall {
  public a = 0;
  public b = 0;
  public c = 0;

  constructor(ball: Ball, side: string) {
    this.a = ball.dir.y;
    this.b = -ball.dir.x;
    if (ball && side === 'low')
      this.c = ball.dir.y * ball.pos.x - ball.dir.x * (ball.pos.y + ball.size * 0.5);
    else if (ball && side === 'up')
      this.c = ball.dir.y * ball.pos.x - ball.dir.x * (ball.pos.y - ball.size * 0.5);
    else if (ball && side === 'left')
      this.c = ball.dir.y * (ball.pos.x - ball.size * 0.5) - ball.dir.x * ball.pos.y;
    else if (ball && side === 'right')
      this.c = ball.dir.y * (ball.pos.x + ball.size * 0.5) - ball.dir.x * ball.pos.y;
  }
}

export class CollisionPointsSides {
  public a = 0;
  public b = 0;
  public c = 0;

  constructor(A: Point, B: Point) {
    this.a = B.y - A.y;
    this.b = A.x - B.x;
    this.c = this.a * A.x + this.b * A.y;
  }
}