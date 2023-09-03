import { Vector } from './vector.model';
import { Point } from './point.model';
import { Board } from './board.model';
import { Player } from './player.model';
import { initGameConfig } from '../init/game.properties';

export class Ball {
  public size: number;
  public halfSize: number;
  public speed: number;
  public speedBackup: number;
  public pos: Point;
  public accelFactor: number;
  public dir: Vector;

  private readonly maxPaddleBounceAngle = initGameConfig.ball.maxPaddleBounceAngle;

  constructor(board: Board, gameMode: number) {
    if (gameMode === 1)
      this.standardInitializer(board);
    else if (gameMode === 2) {
      this.randomInitializer(board);
    } else
      this.standardInitializer(board);
  }

  standardInitializer(board: Board) {
    this.size = initGameConfig.ball.size;
    this.halfSize = initGameConfig.ball.size * 0.5;
    this.speed = initGameConfig.ball.speed;
    this.speedBackup = this.speed;
    this.accelFactor = initGameConfig.ball.accelFactor;
    const toRandomPlayer = Math.random() < 0.5 ? -1 : 1;
    this.randomService(board, toRandomPlayer, 1);
  }

  randomInitializer(board: Board) {
    this.size = Math.round(Math.random() * initGameConfig.ball.maxSize) + 2;
    this.halfSize = this.size * 0.5;
    this.speed = initGameConfig.ball.speed;
    this.speedBackup = this.speed;
    this.accelFactor = initGameConfig.ball.accelFactor;
    const toRandomPlayer = Math.random() < 0.5 ? -1 : 1;
    this.randomService(board, toRandomPlayer, 2);
  }

  clone(board: Board, gameMode: number): Ball {
    const clonedBall = new Ball(board, gameMode);
    clonedBall.size = this.size;
    clonedBall.halfSize = this.halfSize;
    clonedBall.speed = this.speed;
    this.speedBackup = this.speed;
    clonedBall.pos = new Point(this.pos.x, this.pos.y);
    clonedBall.accelFactor = this.accelFactor;
    clonedBall.dir = new Vector(this.dir.x, this.dir.y);
    return clonedBall;
  }

  randomService(board: Board, whichPlayerToServe: number, gameMode: number) {
    if (gameMode === 1) {
      this.speed = this.speedBackup;
    } else if (gameMode === 2) {
      this.size = Math.round(Math.random() * initGameConfig.ball.maxSize) + 2;
      this.halfSize = this.size * 0.5;
      this.speed = Math.round(Math.random() * initGameConfig.ball.maxSpeed) + 75;
    }
    this.pos = new Point(board.width * 0.5, board.height * 0.5);
    const maxAngle = Math.atan((board.height - this.size) / board.width) - 0.1;
    const randomAngle = Math.random() * maxAngle * 2 - maxAngle;
    const dirX = whichPlayerToServe === 1 ? 1 : -1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * dirX,
      Math.sin(randomAngle) * randomY); 

    // const angle = Math.PI / 4;
    // const angle = Math.PI;
    // this.dir = new Vector(
    //   -Math.cos(angle),
    //   Math.sin(angle));

    // this.pos = new Point(140, 70);
  }

  updateDirectionBounce(collisionPercentage: number) {
    let dirX = this.dir.x;
    let value = this.maxPaddleBounceAngle * collisionPercentage;
    if (value <= 0.02 && value >= -0.02) {
      const randomUpDown = Math.random() < 0.5 ? -1 : 1;
      value = 0.02 * randomUpDown;
    }
    this.dir = new Vector(
      Math.cos(value),
      Math.sin(value)
    );
    if (dirX > 0 && this.dir.x > 0)
      this.dir.x *= -1;
    else if (dirX < 0 && this.dir.x < 0)
      this.dir.x *= -1;
  }

  getBallPoint(num: number) {
    // Returns ball corner points
    // 1 : Upper Left     2 : Upper Right      3 : Lower Right      4 : Lower Left
    if (num === 1)
      return (new Point(this.pos.x - this.halfSize, this.pos.y - this.halfSize));
    if (num === 2)
      return (new Point(this.pos.x + this.halfSize, this.pos.y - this.halfSize));
    if (num === 3)
      return (new Point(this.pos.x + this.halfSize, this.pos.y + this.halfSize));
    if (num === 4)
      return (new Point(this.pos.x - this.halfSize, this.pos.y + this.halfSize));
  }

  accelerateBall(gameMode: number) {
    if (gameMode === 1)
      this.speed += this.accelFactor;
    // if (gameMode === 2)
    // this.speed = this.speed Math.round(Math.random * );
  }
}
