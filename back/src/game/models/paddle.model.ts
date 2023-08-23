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
  public colPts: CollisionPointsSides;

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
    this.colPts = new CollisionPointsPaddle(
      new Point(this.pos.x + this.width, this.pos.y),
      new Point(this.pos.x + this.width, this.pos.y + this.height));
  }

  resetPaddleTop(board: Board) {
    this.pos.y = board.height * 0.5 - this.height * 0.5;
  }

  collisionUpdate(playerNum: number) {
    if (playerNum === 1) {
      this.colPts = new CollisionPointsPaddle(
        new Point(this.pos.x + this.width, this.pos.y),
        new Point(this.pos.x + this.width, this.pos.y + this.height));
    } else if (playerNum === 2) {
      this.colPts = new CollisionPointsPaddle(
        new Point(this.pos.x, this.pos.y),
        new Point(this.pos.x, this.pos.y + this.height));
    }
  }
}