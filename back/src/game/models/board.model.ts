import { Ball } from "./ball.model";

export class CollisionPointsBall {
  public a = 0;
  public b = 0;
  public c = 0;

  constructor(ball: Ball, side: string) {
    if (ball && side === 'low') {
      this.a = ball.dir.y;
      this.b = -ball.dir.x;
      this.c = ball.dir.y * ball.pos.x - ball.dir.x * (ball.pos.y + ball.size * 0.5);
    } else if (ball && side === 'up') {
      this.a = ball.dir.y;
      this.b = -ball.dir.x;
      this.c = ball.dir.y * ball.pos.x - ball.dir.x * (ball.pos.y - ball.size * 0.5);
    }
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

  constructor() {
    this.upWall.b = -this.width;
    this.lowWall.b = -this.width;
    this.lowWall.c = -this.width * this.height;

  }
}



// 0, 0              width, 0



// 0, height         width, height