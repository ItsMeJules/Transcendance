import { Ball } from "./ball.model";
import { Paddle } from "./paddle.model";
import { Point } from "./point.model";

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

export class Board {
  // Change here !!!!!
  public width = 600;
  public height = 300;

  public pUpLeft = new Point(0, 0);
  public pUpRight = new Point(this.width, 0);
  public pLowLeft = new Point(0, this.height);
  public pLowRight = new Point(this.width, this.height);

  public pUpLeftPaddle = new Point(0, 0);
  public pLowLeftPaddle = new Point(0, 0);

  public pUpRightPaddle = new Point(0, 0);
  public pLowRightPaddle = new Point(0, 0);

  public upWall: CollisionPointsSides = new CollisionPointsSides(this.pUpLeft, this.pUpRight);
  public lowWall: CollisionPointsSides = new CollisionPointsSides(this.pLowLeft, this.pLowRight);
  public leftWall: CollisionPointsSides = new CollisionPointsSides(this.pUpLeft, this.pLowLeft);
  public rightWall: CollisionPointsSides = new CollisionPointsSides(this.pUpRight, this.pLowRight);

  public leftWallPaddleCol: CollisionPointsSides;
  public rightWallPaddleCol: CollisionPointsSides;

  constructor() { }

  updatePointsAndCollisionParameters(pad: Paddle) {
    // this.pUpLeftPaddle = new Point(0, 0);
    // this.pUpRightPaddle = new Point(this.width, 0);
    // this.pLowLeftPaddle = new Point(pad.width, this.width);
    // this.pLowLeftPaddle = new Point(this.width - pad.width, this.height);

    this.pUpLeftPaddle = new Point(pad.width, 0);
    this.pUpRightPaddle = new Point(this.width - pad.width, 0);
    this.pLowLeftPaddle = new Point(pad.width, this.height);
    this.pLowRightPaddle = new Point(this.width - pad.width, this.height);

    this.leftWallPaddleCol = new CollisionPointsSides(this.pUpLeftPaddle, this.pLowLeftPaddle);
    this.rightWallPaddleCol = new CollisionPointsSides(this.pUpRightPaddle, this.pLowRightPaddle);
  }

}



// 0, 0              width, 0



// 0, height         width, height