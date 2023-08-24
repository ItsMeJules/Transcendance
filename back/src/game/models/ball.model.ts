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

  public it = 0;

  private readonly maxPaddleBounceAngle = initGameConfig.ball.maxPaddleBounceAngle;

  constructor(board: Board, initType: string) {
    if (initType === 'standard')
      this.standardInitializer(board);
    this.standardInitializer(board);
  }

  standardInitializer(board: Board) {
    this.size = initGameConfig.ball.size;
    this.halfSize = initGameConfig.ball.size * 0.5;
    this.speed = initGameConfig.ball.speed;
    this.speedBackup = this.speed;
    this.pos = new Point(board.width * 0.5, board.height * 0.5);
    // this.pos = new Point(300, 200);
    this.pos = new Point(200, 50);
    this.accelFactor = initGameConfig.ball.accelFactor;
    const toRandomPlayer = Math.random() < 0.5 ? -1 : 1;
    this.randomService(board, toRandomPlayer);
  }

  clone(board: Board, initType: string): Ball {
    const clonedBall = new Ball(board, initType);
    clonedBall.size = this.size;
    clonedBall.halfSize = this.halfSize;
    clonedBall.speed = this.speed;
    this.speedBackup = this.speed;
    clonedBall.pos = new Point(this.pos.x, this.pos.y);
    clonedBall.accelFactor = this.accelFactor;
    clonedBall.dir = new Vector(this.dir.x, this.dir.y);
    return clonedBall;
  }

  randomService(board: Board, whichPlayerToServe: number) {
    const maxAngle = Math.atan((board.height - this.size) / board.width);
    const randomAngle = Math.random() * maxAngle * 2 - maxAngle;
    const dirX = whichPlayerToServe === 1 ? 1 : -1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * dirX,
      Math.sin(randomAngle) * randomY);
    this.speed = this.speedBackup;

    // this.it += 1;
    // let side = this.it % 2 === 1 ? 1 : -1;
    const angle = Math.PI / 4;
    this.dir = new Vector(
      -Math.cos(angle),
      Math.sin(angle));
    // this.pos = new Point(board.width * 0.5, board.height * 0.5);

    this.pos = new Point(140, 70);
  }

  updateDirectionBounce(collisionPercentage: number) {
    let dirX = this.dir.x;
    this.dir = new Vector(
      Math.cos(this.maxPaddleBounceAngle * collisionPercentage),
      Math.sin(this.maxPaddleBounceAngle * collisionPercentage)
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
}
