import { Board } from "./board.model";
import { Point } from "./point.model";
import { initGameConfig } from "../init/game.properties";
import { CollisionPointsSides } from "./collisionPoints.model";
import { CollisionPointsPaddle } from "./collisionPointsPaddle.model";

export class Paddle {
  public width: number;
  public height: number;
  public wallGap: number;
  public speed: number;
  public pos: Point;
  public prevPos: Point;
  public colPtsSide: CollisionPointsPaddle;
  public colPtsUp: CollisionPointsPaddle;
  public colPtsDown: CollisionPointsPaddle;

  constructor(board: Board, initType: string, player: number) {
    if (initType === 'standard')
      this.standardInitializer(board, initType, player);
    this.standardInitializer(board, initType, player);
  }

  standardInitializer(board: Board, initType: string, player: number) {
    this.width = initGameConfig.pad.width;
    this.height = initGameConfig.pad.height;
    this.wallGap = initGameConfig.pad.wallGap;
    this.speed = initGameConfig.pad.speed;
    if (player === 1)
      this.pos = new Point(
        this.wallGap,
        (board.height - this.height) * 0.5);
    else
      this.pos = new Point(
        board.width - this.wallGap - this.width,
        (board.height - this.height) * 0.5);
    this.prevPos = new Point(this.pos.x, this.pos.y);
    this.colPtsSide = new CollisionPointsPaddle(
      new Point(this.pos.x + this.width, this.pos.y),
      new Point(this.pos.x + this.width, this.pos.y + this.height));
    this.colPtsUp = new CollisionPointsPaddle(
      new Point(this.pos.x, this.pos.y),
      new Point(this.pos.x + this.width, this.pos.y));
    this.colPtsDown = new CollisionPointsPaddle(
      new Point(this.pos.x, this.pos.y + this.height),
      new Point(this.pos.x + this.width, this.pos.y + this.height));
  }

  resetPaddleTop(board: Board) {
    this.pos.y = board.height * 0.5 - this.height * 0.5;
  }

  collisionUpdate(playerNum: number) {
    if (playerNum === 1) {
      this.colPtsSide = new CollisionPointsPaddle(
        new Point(this.pos.x + this.width, this.pos.y),
        new Point(this.pos.x + this.width, this.pos.y + this.height));
    } else if (playerNum === 2) {
      this.colPtsSide = new CollisionPointsPaddle(
        new Point(this.pos.x, this.pos.y),
        new Point(this.pos.x, this.pos.y + this.height));
    }
    this.colPtsUp = new CollisionPointsPaddle(
      new Point(this.pos.x, this.pos.y),
      new Point(this.pos.x + this.width, this.pos.y));
    this.colPtsDown = new CollisionPointsPaddle(
      new Point(this.pos.x, this.pos.y + this.height),
      new Point(this.pos.x + this.width, this.pos.y + this.height));
  }

  pointInPaddle(p: Point) {
    if ((p.x >= this.pos.x && p.x <= this.pos.x + this.width)
      && (p.y >= this.pos.y && p.y <= this.pos.x + this.height))
      return true;
    return false;
  }

  getPaddlePoint(num: number) {
    // Returns points
    // 1 : Upper Left
    // 2 : Upper Right
    // 3 : Lower Right
    // 4 : Lower Left
    if (num === 1)
      return (this.pos);
    if (num === 2)
      return (new Point(this.pos.x + this.width, this.pos.y));
    if (num === 3)
      return (new Point(this.pos.x + this.width, this.pos.y + this.height));
    if (num === 4)
      return (new Point(this.pos.x, this.pos.y + this.height));
  }

  getPaddleNewPoint(num: number, newPos: Point) {
    // Returns points
    // 1 : Upper Left
    // 2 : Upper Right
    // 3 : Lower Right
    // 4 : Lower Left
    if (num === 1)
      return (newPos);
    if (num === 2)
      return (new Point(newPos.x + this.width, newPos.y));
    if (num === 3)
      return (new Point(newPos.x + this.width, newPos.y + this.height));
    if (num === 4)
      return (new Point(newPos.x, newPos.y + this.height));
  }
}