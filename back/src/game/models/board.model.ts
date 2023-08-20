import { Ball } from "./ball.model";

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

}

export class Board {
  // Change here if needed
  public width = 600;
  public height = 300;

  public upWall: CollisionPointsSides = new CollisionPointsSides();
  public lowWall: CollisionPointsSides = new CollisionPointsSides();
  public leftWall: CollisionPointsSides = new CollisionPointsSides();
  public rightWall: CollisionPointsSides = new CollisionPointsSides();

  constructor() {
    this.upWall.b = -this.width;
    this.lowWall.b = -this.width;
    this.lowWall.c = -this.width * this.height;
    this.leftWall.a = this.height;
    this.rightWall.a = this.height;
    this.rightWall.c = this.rightWall.a * this.width;
  }
}



// 0, 0              width, 0



// 0, height         width, height