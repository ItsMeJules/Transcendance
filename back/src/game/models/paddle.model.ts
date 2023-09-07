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
  public posPrev: Point;
  public prevPos: Point;
  public colPtsSide: CollisionPointsPaddle;
  public colPtsUp: CollisionPointsPaddle;
  public colPtsDown: CollisionPointsPaddle;

  constructor(board: Board, gameMode: number, player: number) {
    if (gameMode === 1)
      this.standardInitializer(board, player);
    else if (gameMode === 2)
      this.randomInitializer(board, player);
    else
      this.standardInitializer(board, player);
  }

  standardInitializer(board: Board, player: number) {
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

  randomInitializer(board: Board, player: number) {
    this.width = Math.round(Math.random() * initGameConfig.pad.maxWidth) + 2;
    // this.width = 0;
    
    this.height = Math.round(Math.random() * initGameConfig.pad.maxHeight) + 2;
    // this.height = initGameConfig.pad.maxHeight
    this.height = this.height < 30 ? 30 : this.height;
    this.wallGap = initGameConfig.pad.wallGap;
    let maxSpeed = this.width >= initGameConfig.pad.maxWidth * 0.5 ?
      initGameConfig.pad.maxSpeed * 0.6 : initGameConfig.pad.speed;
    maxSpeed = this.height >= initGameConfig.pad.maxHeight * 0.5 ?
      Math.round(maxSpeed * 1.55) : Math.round(maxSpeed * 0.85);
    this.speed = Math.round(Math.random() * maxSpeed) + 100;
    this.speed = this.speed * (2 - this.width / initGameConfig.pad.maxWidth);
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

  getPaddleNewPoint(num: number, newPos: Point) {
    // Returns paddle corner points
    // 1 : Upper Left     2 : Upper Right     3 : Lower Right     4 : Lower Left
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