import { Ball } from "./ball.model";
import { Paddle } from "./paddle.model";
import { Point } from "./point.model";
import { initGameConfig } from "../init/game.properties";
import { initialize } from "passport";

export class CollisionPointsPaddle {
  public a = 0;
  public b = 0;
  public c = 0;

  constructor(A: Point, B: Point) {
    this.a = B.y - A.y;
    this.b = A.x - B.x;
    this.c = this.a * A.x + this.b * A.y;
  }
}