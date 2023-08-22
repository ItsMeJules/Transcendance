import { Vector } from './vector.model';
import { Point } from './point.model';
import { Board } from './board.model';
import { Player } from './player.model';
import { initGameConfig } from '../init/game.properties';

export class Ball {
  public size: number;
  public halfSize: number;
  public speed: number;
  public pos: Point;
  public accelFactor: number;
  public dir: Vector;
  public tRefresh = Date.now();

  private readonly maxPaddleBounceAngle = initGameConfig.ball.maxPaddleBounceAngle;

  constructor(board: Board, initType: string) {
    if (initType === 'standard')
      this.standardInitializer(board);
    this.standardInitializer(board);
    //
    // this.dir = new Vector(1, 0);
  }

  standardInitializer(board: Board) {
    this.size = initGameConfig.ball.size;
    this.halfSize = initGameConfig.ball.size * 0.5;
    this.speed = initGameConfig.ball.speed;
    this.pos = new Point(board.width * 0.5, board.height * 0.5);
    this.accelFactor = initGameConfig.ball.accelFactor;
    const toRandomPlayer = Math.random() < 0.5 ? -1 : 1;
    this.randomService(board, toRandomPlayer);
    //
    // this.dir = new Vector(0.7, 0.4);
    // const angle = Math.PI / 3;
    // this.dir = new Vector(
    //   Math.cos(angle),
    //   -Math.sin(angle));

    // this.dir = new Vector(1, 0);
  }

  clone(board: Board, initType: string): Ball {
    const clonedBall = new Ball(board, initType);
    clonedBall.size = this.size;
    clonedBall.halfSize = this.halfSize;
    clonedBall.speed = this.speed;
    clonedBall.pos = new Point(this.pos.x, this.pos.y);
    clonedBall.accelFactor = this.accelFactor;
    clonedBall.dir = new Vector(this.dir.x, this.dir.y);
    clonedBall.tRefresh = this.tRefresh;
    return clonedBall;
  }

  randomService(board: Board, whichPlayerToServe: number) {
    const maxAngle = Math.atan((board.height - this.size) / board.width);
    // console.log('maxangle:', maxAngle);
    const randomAngle = Math.random() * maxAngle * 2 - maxAngle;
    // console.log('random angle degree:', randomAngle * 180 / Math.PI);
    const dirX = whichPlayerToServe === 1 ? 1 : -1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * dirX,
      Math.sin(randomAngle) * randomY);



    // const angle = Math.PI / 3;
    // this.dir = new Vector(
    //   -Math.cos(angle),
    //   -Math.sin(angle));
    // const angle = Math.PI / 12;
    // this.dir = new Vector(
    //   -Math.cos(angle),
    //   Math.sin(angle));
  }

  updateDirectionBounce(collisionPercentage: number, side: string) {
    this.dir = new Vector(
      Math.cos(this.maxPaddleBounceAngle * collisionPercentage),
      Math.sin(this.maxPaddleBounceAngle * collisionPercentage)
    );
    if (side === 'right') this.dir.x *= -1;
  }


}
