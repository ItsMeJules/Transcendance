import { Paddle } from "./paddle.model";
import { Point } from "./point.model";
import { initGameConfig } from "../init/game.properties";
import { CollisionPointsSides } from "./collisionPoints.model";

export class Board {
  public width = initGameConfig.board.width;
  public height = initGameConfig.board.height;

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
    this.pUpLeftPaddle = new Point(pad.wallGap + pad.width, 0);
    this.pUpRightPaddle = new Point(this.width - pad.width - pad.wallGap, 0);
    this.pLowLeftPaddle = new Point(pad.wallGap + pad.width, this.height);
    this.pLowRightPaddle = new Point(this.width - pad.width - pad.wallGap, this.height);

    this.leftWallPaddleCol = new CollisionPointsSides(this.pUpLeftPaddle, this.pLowLeftPaddle);
    this.rightWallPaddleCol = new CollisionPointsSides(this.pUpRightPaddle, this.pLowRightPaddle);
  }

}



    // this.pUpLeftPaddle = new Point(0, 0);
    // this.pUpRightPaddle = new Point(this.width, 0);
    // this.pLowLeftPaddle = new Point(pad.width, this.width);
    // this.pLowLeftPaddle = new Point(this.width - pad.width, this.height);

// 0, 0              width, 0



// 0, height         width, height