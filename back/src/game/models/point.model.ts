import { Ball } from "./ball.model";

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceToPoint(other: Point) {
    return Math.sqrt(Math.pow((this.x - other.x), 2) + Math.pow((this.y - other.y), 2));
  }

  distanceToPointBallSide(ball: Ball, side: string) {
    if (side === 'low')
      return Math.sqrt(
        Math.pow((this.x - ball.pos.x), 2) +
        Math.pow((this.y - (ball.pos.y + ball.size / 2)), 2));
    else if (side === 'up') {
      return Math.sqrt(
        Math.pow((this.x - ball.pos.x), 2) +
        Math.pow((this.y - (ball.pos.y - ball.size / 2)), 2));
    }
  }
}
