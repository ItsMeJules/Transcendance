import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { PongEvents } from './pong.gateway';
import { CollisionPointsBall, CollisionPointsSides } from './models/collisionPoints.model';
import { copyFileSync } from 'fs';
import { CollisionPointsPaddle } from './models/collisionPointsPaddle.model';

export interface GameParams {
  pl1: Player;
  pl2: Player;
  ball: Ball;
}

export class GameStruct {
  public prop: GameProperties;
  public board: Board;
  public ball: Ball;
  public pl1: Player;
  public pl2: Player;

  public prevFrameTime = 0;
  public playerPrevFrameTime = 0;
  public first = true;
  public scoring = false;
  public collisionType = '';
  public prints = 12 * 4;

  private readonly updateInterval: number = 100; // Adjust as needed
  private updateIntervalId: NodeJS.Timeout | null = null;
  private readonly frameRate: number = 60; // 1 / s
  private readonly frameDuration: number = 1000 / this.frameRate; // s
  private gameLoopInterval: NodeJS.Timeout | null = null;
  public paddleLoopInterval: NodeJS.Timeout | null = null;

  constructor(id: number, pl1Id: number, pl2Id: number, room: string,
    private pongEvents: PongEvents) {
    this.prop = new GameProperties(id, room);
    this.board = new Board();
    this.ball = new Ball(this.board, 'standard');
    this.pl1 = new Player(this.board, 'standard', pl1Id, 1);
    this.pl2 = new Player(this.board, 'standard', pl2Id, 2);
    this.board.updatePointsAndCollisionParameters(this.pl1.pad);
  }

  startGameLoop() {
    let frame = 0;
    let isStart = true;
    this.ball.tRefresh = Date.now();
    console.log('tRefresh at start:', this.ball.tRefresh);
    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {
        if (!this.scoring) {
          this.updateGame(frame, isStart);
        }
      }, 0);
    }
  }

  private updateGame(frame: number, isStart: boolean) {
    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.prevFrameTime;
    if (!isStart) {
      frame = Date.now() - frame;
      this.updateBallPosition(deltaTime);
    }
    isStart = false;
    this.sendUpdate();
    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    frame = Date.now();
    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.updateGame(frame, isStart);
    }, remainingTime);
    this.prevFrameTime = frameStartTime;
  }

  private updateBallPosition(frame: number) {
    const deltaX = this.ball.speed * this.ball.dir.x * (frame / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (frame / 1000);
    const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);

    this.updatePlayers(frame);
    let ret = this.checkBoxCollisions(newPos);
    if (ret === -1) return;
    this.ball.prevPos = new Point(this.ball.pos.x, this.ball.pos.y);
    this.ball.pos.x = newPos.x;
    this.ball.pos.y = newPos.y;

    // console.log('')

    // console.log(' ');
  }

  // isBallInPaddle(player: Player) {
  //   let A = new Point(this.ball.pos.x - this.ball.halfSize, this.ball.pos.y - this.ball.halfSize);
  //   let B = new Point(this.ball.pos.x - this.ball.halfSize, this.ball.pos.y + this.ball.halfSize);
  //   let C = new Point(this.ball.pos.x + this.ball.halfSize, this.ball.pos.y - this.ball.halfSize);
  //   let D = new Point(this.ball.pos.x + this.ball.halfSize, this.ball.pos.y + this.ball.halfSize);
  //   if (player.pad.pointInPaddle(A) || player.pad.pointInPaddle(B)
  //     || player.pad.pointInPaddle(C) || player.pad.pointInPaddle(D))
  //     return true;
  //   return false;
  // }

  updatePlayers(frame: number) {
    // Player 1



    if (this.pl1.isMoving && this.pl1.movingDir === 'up') {
      // if (this.ball.pos.x - this.ball.halfSize < 30) {
      //   let test = this.isBallInPaddle(this.pl1);
      //   console.log('isBallInPaddle:', test);
      // }

      let pl1NewPos = new Point(
        this.pl1.pad.pos.x, this.pl1.pad.pos.y - this.pl1.pad.speed * (frame / 1000));
      if (pl1NewPos.y < this.ball.size * 2)
        this.pl1.pad.pos.y = this.ball.size * 2;
      else
        this.pl1.pad.pos = pl1NewPos;
    } else if (this.pl1.isMoving && this.pl1.movingDir === 'down') {
      let pl1NewPos = new Point(
        this.pl1.pad.pos.x, this.pl1.pad.pos.y + this.pl1.pad.speed * (frame / 1000));
      if (pl1NewPos.y > this.board.height - this.pl1.pad.height - this.ball.size * 2)
        this.pl1.pad.pos.y = this.board.height - this.pl1.pad.height - this.ball.size * 2;
      else
        this.pl1.pad.pos = pl1NewPos;
    }

    // Player 2
    if (this.pl2.isMoving && this.pl2.movingDir === 'up') {
      let pl2NewPos = new Point(
        this.pl2.pad.pos.x, this.pl2.pad.pos.y - this.pl2.pad.speed * (frame / 1000));
      if (pl2NewPos.y < this.ball.size * 2)
        this.pl2.pad.pos.y = this.ball.size * 2;
      else
        this.pl2.pad.pos = pl2NewPos;
    } else if (this.pl2.isMoving && this.pl2.movingDir === 'down') {
      let pl2NewPos = new Point(
        this.pl2.pad.pos.x, this.pl2.pad.pos.y + this.pl2.pad.speed * (frame / 1000));
      if (pl2NewPos.y > this.board.height - this.pl1.pad.height - this.ball.size * 2)
        this.pl2.pad.pos.y = this.board.height - this.pl1.pad.height - this.ball.size * 2;
      else
        this.pl2.pad.pos = pl2NewPos;
    }
  }

  checkBoxCollisions(newPos: Point) {
    // Left score
    if (newPos.x - this.ball.halfSize <= 0 && this.ball.dir.x < 0) {
      console.log('SCORE');
      console.log(' ');
      this.scorePoint(2);
      return -1;
    }
    // Right score
    else if (newPos.x + this.ball.halfSize >= this.board.width && this.ball.dir.x > 0) {
      this.scorePoint(1);
      return -1;
    }
    // Up and Low Wall
    else if ((newPos.y - this.ball.halfSize <= 0 && this.ball.dir.y < 0)
      || (newPos.y + this.ball.halfSize >= this.board.height && this.ball.dir.y > 0))
      this.ball.dir.y *= -1;
    else {
      // Paddles
      let player: Player = this.ball.dir.x < 0 ? this.pl1 : this.pl2;
      this.ball.dir.x < 0 ? player.pad.collisionUpdate(1) : player.pad.collisionUpdate(2);
      let colPtSide: Point = this.getCollisionPointSide(player, player.pad.colPtsSide);
      let colPtUp: Point = this.getCollisionPointSide(player, player.pad.colPtsUp);
      let colPtDown: Point = this.getCollisionPointSide(player, player.pad.colPtsDown);

      if (this.ball.pos.x - this.ball.halfSize < 26) {
        // console.log('bdir yx:', this.ball.dir.x, ' y:', this.ball.dir.y);
        // console.log('____UP_______');
        // console.log('npy +hsy >= colupy: ', newPos.y + this.ball.halfSize, ' >= ', colPtUp.y);
        // console.log('bpy +hsy <= colupy: ', this.ball.pos.y + this.ball.halfSize, ' <= ', colPtUp.y);
        // console.log('colPtupy:', colPtUp.y);
        // console.log('____Left_____');
        // console.log('npyx -hsy >= colupy: ', newPos.x - this.ball.halfSize, ' <= ', colPtSide.x);
        // console.log('bpx +hsy <= colupy: ', this.ball.pos.x - this.ball.halfSize, ' >= ', colPtSide.x);
        // console.log('prevPos x-hf:', this.ball.prevPos.x - this.ball.halfSize);

        // console.log(' ');

        console.log(' ');


      }


      // Up
      if (this.ball.dir.y > 0
        && newPos.y + this.ball.halfSize >= colPtUp.y
        && this.ball.pos.y + this.ball.halfSize <= colPtUp.y) {
        console.log('OKKKKKKKKKKKKKKKKKKKKKKKKKKK UPPPPPPPP');
        console.log(' ');
        return this.getNewPointAfterCollisionUpDown(player, newPos, colPtUp);
      }
      // Down
      else if (this.ball.dir.y < 0
        && newPos.y - this.ball.halfSize <= colPtDown.y
        && this.ball.pos.y - this.ball.halfSize >= colPtDown.y) {
        return this.getNewPointAfterCollisionUpDown(player, newPos, colPtDown);
      }
      // Left
      else if (this.ball.dir.x < 0
        && newPos.x - this.ball.halfSize <= colPtSide.x
        && this.ball.pos.x - this.ball.halfSize >= colPtSide.x) {
        console.log('OKKKKKKKKKKKKKKKKKKKKKKKKKKK LEEEEEEEEEEEEEFT');
        return this.getNewPointAfterCollisionSide(player, newPos, colPtSide);
      }
      // Right
      else if (this.ball.dir.x > 0
        && newPos.x + this.ball.halfSize >= colPtSide.x
        && this.ball.pos.x + this.ball.halfSize <= colPtSide.x) {
        console.log('OKKKKKKKKKKKKKKKKKKKKKKKKKKK RRRRRRRRRRRIGGGGGGGGGGGHT');
        return this.getNewPointAfterCollisionSide(player, newPos, colPtSide);
      }

    }
    return 1;
  }

  getDistance(A: Point, B: Point) {
    return Math.sqrt(Math.pow((A.x - B.x), 2) + Math.pow((A.y - B.y), 2));
  }

  getNewPointAfterCollisionUpDown(player: Player, newPos: Point, colPt: Point) {
    let ballPosY = this.ball.pos.y < player.pad.pos.y ?
      this.ball.pos.y + this.ball.halfSize : this.ball.pos.y - this.ball.halfSize;
    let newPosY = this.ball.pos.y < player.pad.pos.y ?
      newPos.y + this.ball.halfSize : newPos.y - this.ball.halfSize;
    // console.log('ballposy OK:', ballPosY);
    // console.log('newposy OK:', newPosY);
    let dPartial = colPt.y - ballPosY;
    // console.log('dpartial:', dPartial);
    let dFull = newPosY - ballPosY;
    // console.log('dfull:', dFull);
    let dPartialX = dPartial * this.ball.dir.x / this.ball.dir.y;
    let dFullX = dFull * this.ball.dir.x / this.ball.dir.y;
    let tmpBallPos = new Point(this.ball.pos.x + dPartialX, this.ball.pos.y + dPartial);
    // console.log('tmp ballpos:', tmpBallPos);
    if (!this.isBallInFrontOfPaddleUpDown(player, tmpBallPos)) return 1; /// to do
    // if (this.ball.pos.y < player.pad.pos.y) // dont change sign if not needed
    this.ball.dir.y *= -1;
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullX - dPartialX), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
    // console.log('tmp ballpos2:', tmpBall2);
    this.ball.pos = tmpBall2;
    return -1;
  }

  isBallInFrontOfPaddleUpDown(player: Player, newPos: Point) {
    // Check ball points
    if ((newPos.x - this.ball.halfSize >= player.pad.pos.x
      && newPos.x - this.ball.halfSize <= player.pad.pos.x + player.pad.width))
      return true;
    if ((newPos.x + this.ball.halfSize >= player.pad.pos.x
      && newPos.x - this.ball.halfSize <= player.pad.pos.x + player.pad.width))
      return true;
    // Check paddle points
    if ((player.pad.pos.x >= newPos.x - this.ball.halfSize)
      && (player.pad.pos.x <= newPos.x + this.ball.halfSize))
      return true;
    if ((player.pad.pos.x + player.pad.width >= newPos.x - this.ball.halfSize)
      && (player.pad.pos.x + player.pad.width <= newPos.x + this.ball.halfSize))
      return true;
    return false;
  }

  getNewPointAfterCollisionSide(player: Player, newPos: Point, colPt: Point) {
    let ballPosX = this.ball.dir.x < 0 ? this.ball.pos.x - this.ball.halfSize : this.ball.pos.x + this.ball.halfSize;
    let newPosX = this.ball.dir.x < 0 ? newPos.x - this.ball.halfSize : newPos.x + this.ball.halfSize;
    let dPartial = colPt.x - ballPosX;
    let dFull = newPosX - ballPosX;
    let dPartialY = dPartial * this.ball.dir.y / this.ball.dir.x;
    let dFullY = dFull * this.ball.dir.y / this.ball.dir.x;
    let tmpBallPos = new Point(this.ball.pos.x + dPartial, this.ball.pos.y + dPartialY);
    if (!this.isBallInFrontOfPaddleSide(player, tmpBallPos)) return 1;
    // console.log('OK HEREEEEEEEEEEEEEEEEEEEE ehehe');
    let colPercentage = this.getCollisionPercentage(player, tmpBallPos);
    this.ball.updateDirectionBounce(colPercentage);
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullY - dPartialY), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
    this.ball.pos = tmpBall2;
    return -1;
  }

  getCollisionPercentage(player: Player, ballPos: Point) {
    let padCenterPos = player.pad.pos.y + player.pad.height * 0.5;
    let padFullSize = (player.pad.height + this.ball.size) * 0.5;
    return ((ballPos.y - padCenterPos) / padFullSize);
  }

  getCollisionPointSide(player: Player, colPts: CollisionPointsPaddle) {
    let colPt: Point;
    // let plColPts = player.pad.colPtsSide;
    let ballColPts = new CollisionPointsBall(this.ball);
    let determinant = ballColPts.a * colPts.b - ballColPts.b * colPts.a;
    if (determinant === 0) {
      colPt = new Point(1000000, 1000000);
    } else {
      colPt = new Point(
        (colPts.b * ballColPts.c - ballColPts.b * colPts.c) / determinant,
        (ballColPts.a * colPts.c - colPts.a * ballColPts.c) / determinant);
    }
    return colPt;
  }

  isBallInFrontOfPaddleSide(player: Player, newPos: Point) {
    // Check ball points
    // console.log('____PADDLE LEFT POINTS _____');
    // console.log('1npy-hsy >= pad.y: ', newPos.y - this.ball.halfSize, ' >= ', player.pad.pos.y);
    // console.log('1npy-hsy <= pad.y_low: ', newPos.y - this.ball.halfSize, ' <= ', player.pad.pos.y + player.pad.height);

    // console.log('2npy+hsy >= pad.y: ', newPos.y + this.ball.halfSize, ' >= ', player.pad.pos.y);
    // console.log('2npy+hsy <= pad.y_low: ', newPos.y - this.ball.halfSize, ' <= ', player.pad.pos.y + player.pad.height);

    // console.log('3pady >= bposyup: ', player.pad.pos.y, ' >= ',newPos.y - this.ball.halfSize);
    // console.log('3pady <= bposylow: ', player.pad.pos.y, ' <= ', newPos.y + this.ball.halfSize);

    // console.log('4pad y low >= bposyup: ', player.pad.pos.y + player.pad.height, ' >= ', newPos.y - this.ball.halfSize);
    // console.log('4pad y low <= bposylow: ', player.pad.pos.y + player.pad.height, ' <= ', newPos.y + this.ball.halfSize);



    if ((newPos.y - this.ball.halfSize >= player.pad.pos.y
      && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height))
      return true;

    if ((newPos.y + this.ball.halfSize >= player.pad.pos.y
      && newPos.y + this.ball.halfSize <= player.pad.pos.y + player.pad.height))
      return true;

    // Check paddle points
    if ((player.pad.pos.y >= newPos.y - this.ball.halfSize)
      && (player.pad.pos.y <= newPos.y + this.ball.halfSize))
      return true;

    if ((player.pad.pos.y + player.pad.height >= newPos.y - this.ball.halfSize)
      && (player.pad.pos.y + player.pad.height <= newPos.y + this.ball.halfSize))
      return true;
    return false;
  }

  scorePoint(winner: number) {
    if (winner === 2) {
      this.pl2.score += 1;
      this.ball.pos = new Point(this.board.width * 0.5, this.board.height * 0.5);
      this.ball.tRefresh = Date.now();
      this.ball.randomService(this.board, 2);
      this.collisionType = '';
    } else if (winner === 1) {
      this.pl1.score += 1;
      this.ball.pos = new Point(this.board.width * 0.5, this.board.height * 0.5);
      this.ball.tRefresh = Date.now();
      this.ball.randomService(this.board, 1);
      this.collisionType = '';
    }
  }

  refreshInMotion(from: string) {
    console.log('refresh in motion');
    let tmpBall = this.ball.clone(this.board, 'standard');
    let tInterval = Date.now() - this.ball.tRefresh;
    tmpBall.pos.x += tmpBall.speed * tmpBall.dir.x * (tInterval / 1000);
    tmpBall.pos.y += tmpBall.speed * tmpBall.dir.y * (tInterval / 1000);
    let tmpGameParams: GameParams = this.getState();
    tmpGameParams.ball = tmpBall;
    console.log(from, ' b:', tmpBall.pos, ' pl1:', this.pl1.pad.pos.y, ' pl2:', this.pl2.pad.pos.y);
    console.log('tRefresh at in Motion:', this.ball.tRefresh);
    this.pongEvents.server.to(this.prop.room).emit('refreshGame',
      { gameStatus: this.prop.status, gameParams: tmpGameParams, time: Date.now() });
  }

  private startRegularUpdates() {
    if (!this.updateIntervalId) {
      this.updateIntervalId = setInterval(() => {
        this.sendRegularUpdate();
      }, this.updateInterval);
    }
  }

  private sendRegularUpdate() {
    this.pongEvents.pongService.onlineGames.forEach((value, key) => {
      if (value.prop.status === 'playing')
        this.pongEvents.server.to(value.prop.room).emit('refreshGame',
          { gameStatus: value.prop.status, gameParams: value.getState(), time: Date.now() });
    });
  }

  private sendUpdate() {
    if (this.prop.status === 'playing')
      this.pongEvents.server.to(this.prop.room).emit('refreshGame',
        { gameStatus: this.prop.status, gameParams: this.getState(), time: Date.now() });
  }

  setPlayerReady(id: number) {
    if (id === this.pl1.id)
      this.pl1.status = 'ready';
    else if (id === this.pl2.id)
      this.pl2.status = 'ready';
  }

  bothPlayersReady() {
    if (this.pl1.status === 'ready'
      && this.pl2.status === 'ready')
      return true;
    return false;
  }

  getState(): GameParams {
    const state: GameParams = {
      pl1: this.pl1,
      pl2: this.pl2,
      ball: this.ball,
    };
    return state;
  }

  stopGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  movePlayerUp(player: Player) {
    if (player.isMoving && player.movingDir === 'up') return;
    player.isMoving = true;
    player.movingDir = 'up';
  }

  movePlayerDown(player: Player) {
    if (player.isMoving && player.movingDir === 'down') return;
    player.isMoving = true;
    player.movingDir = 'down';
  }


}
