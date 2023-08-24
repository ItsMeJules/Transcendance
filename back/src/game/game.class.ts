import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { PongEvents } from './pong.gateway';
import { CollisionPointsBall, CollisionPointsSides } from './models/collisionPoints.model';
import { copyFileSync } from 'fs';
import { CollisionPointsPaddle } from './models/collisionPointsPaddle.model';
import { Paddle } from './models/paddle.model';

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
    let isStart = true;
    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {
        if (!this.scoring) {
          this.updateGame(isStart);
        }
      }, 0);
    }
  }

  private updateGame(isStart: boolean) {
    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.prevFrameTime;
    if (!isStart)
      this.updateBallPosition(deltaTime);
    isStart = false;
    this.sendUpdate();
    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.updateGame(isStart);
    }, remainingTime);
    this.prevFrameTime = frameStartTime;
  }

  private updateBallPosition(deltaTime: number) {
    this.updatePlayers(deltaTime);
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);
    const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);
    let ret = this.checkBoxCollisions(newPos);
    if (ret === -1) return;
    this.ball.pos.x = newPos.x;
    this.ball.pos.y = newPos.y;
  }

  updatePlayers(deltaTime: number) {
    // Player 1
    if (this.pl1.isMoving && this.pl1.movingDir === 'up') {
      let pad = this.pl1.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y - pad.speed * (deltaTime / 1000));
      if (newPos.y < this.ball.size * 2)
        newPos.y = this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionUp(newPos, pad)
        && !this.ballAndPaddleUnionUp(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y - this.ball.halfSize;
        this.ball.speed = pad.speed > this.ball.speed ? pad.speed : this.ball.speed;
      }
    } else if (this.pl1.isMoving && this.pl1.movingDir === 'down') {
      console.log('DOWNNNNNNNNNNNNNNNNNNNNNNNNNNNNN PLAYER');
      // also modify player 2 accordingly!!!
      let pad = this.pl1.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y + pad.speed * (deltaTime / 1000));
      if (newPos.y > this.board.height - pad.height - this.ball.size * 2)
        newPos.y = this.board.height - pad.height - this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;

      let pptmp = new Point(padPosPrev.x, padPosPrev.y + pad.height);
      let nptmp = new Point(newPos.x, newPos.y + pad.height);
      // console.log('bpos:', this.ball.pos.y);
      // console.log('padPrev:', pptmp.y);
      // console.log('padNew:', newPos.y);
      // console.log('union now:', this.ballAndPaddleUnionDown(newPos, pad));
      // console.log('union prev:', this.ballAndPaddleUnionDown(padPosPrev, pad));

      if (this.ballAndPaddleUnionDown(newPos, pad) && !this.ballAndPaddleUnionDown(padPosPrev, pad)) {
        // console.log('triggered!!!!!!!!!!!!!!!!!!!');
        this.ball.pos.y = newPos.y + pad.height + this.ball.halfSize;
        this.ball.speed = pad.speed > this.ball.speed ? pad.speed : this.ball.speed;
      }
    }
    // Player 2
    if (this.pl2.isMoving && this.pl2.movingDir === 'up') {
      let pad = this.pl2.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y - pad.speed * (deltaTime / 1000));
      if (newPos.y < this.ball.size * 2)
        newPos.y = this.ball.size * 2;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionUp(newPos, pad)) {
        this.ball.pos.y = newPos.y - this.ball.halfSize;
        this.ball.speed = pad.speed > this.ball.speed ? pad.speed : this.ball.speed;
      }
    } else if (this.pl2.isMoving && this.pl2.movingDir === 'down') {
      let pad = this.pl2.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y + pad.speed * (deltaTime / 1000));
      if (newPos.y > this.board.height - pad.height - this.ball.size * 2)
        newPos.y = this.board.height - pad.height - this.ball.size * 2;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionDown(newPos, pad)) {
        this.ball.pos.y = newPos.y + pad.height + this.ball.halfSize;
        this.ball.speed = pad.speed > this.ball.speed ? pad.speed : this.ball.speed;
      }
    }
  }

  ballAndPaddleUnionUp(pos: Point, pad: Paddle) {
    if ((this.isPointInBall(pos)
      || this.isPointInBall(new Point(pos.x + pad.width, pos.y)))
      || (this.isPointInNewPaddle(this.ball.getBallPoint(3), pad, pos)
        || this.isPointInNewPaddle(this.ball.getBallPoint(4), pad, pos)))
      return true;
    return false;
  }

  ballAndPaddleUnionDown(pos: Point, pad: Paddle) {
    let posDown = new Point(pos.x, pos.y + pad.height);
    // console.log('__UNION__');
    // console.log('')
    if ((this.isPointInBall(posDown)
      || this.isPointInBall(new Point(posDown.x + pad.width, posDown.y)))
      || (this.isPointInNewPaddle(this.ball.getBallPoint(2), pad, pos)
        || this.isPointInNewPaddle(this.ball.getBallPoint(1), pad, pos)))
      return true;
    return false;
  }

  isPointInBall(p: Point) {
    let b = this.ball;
    if (!(p.x >= b.getBallPoint(1).x && p.x <= b.getBallPoint(2).x))
      return false;
    if (!(p.y >= b.getBallPoint(1).x && p.y <= b.getBallPoint(4).y))
      return false;
    return true;
  }

  isPointInNewPaddle(p: Point, pad: Paddle, newPos: Point) {
    if (!(p.x >= newPos.x && p.x <= newPos.x + pad.width))
      return false;
    if (!(p.y >= newPos.y && p.y <= newPos.y + pad.height))
      return false;
    return true;
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
    // Up and Low Wall collisions
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
      // Left
      if (this.ball.dir.x < 0
        && newPos.x - this.ball.halfSize <= colPtSide.x
        && this.ball.pos.x - this.ball.halfSize >= colPtSide.x) {
        console.log('-> Left');
        return this.getNewPointAfterCollisionSide(player, newPos, colPtSide);
      }
      // Right
      else if (this.ball.dir.x > 0
        && newPos.x + this.ball.halfSize >= colPtSide.x
        && this.ball.pos.x + this.ball.halfSize <= colPtSide.x) {
          console.log('-> RIGHT');
        return this.getNewPointAfterCollisionSide(player, newPos, colPtSide);
      }
      // Up
      else if (this.ball.dir.y > 0
        && newPos.y + this.ball.halfSize >= colPtUp.y
        && this.ball.pos.y + this.ball.halfSize <= colPtUp.y) {
        return this.getNewPointAfterCollisionUpDown(player, newPos, colPtUp);
      }
      // Down
      else if (this.ball.dir.y < 0
        && newPos.y - this.ball.halfSize <= colPtDown.y
        && this.ball.pos.y - this.ball.halfSize >= colPtDown.y) {
        console.log('-> DOWN:', this.getNewPointAfterCollisionUpDown(player, newPos, colPtDown));
        return this.getNewPointAfterCollisionUpDown(player, newPos, colPtDown);
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
    let dPartial = colPt.y - ballPosY;
    let dFull = newPosY - ballPosY;
    let dPartialX = dPartial * this.ball.dir.x / this.ball.dir.y;
    let dFullX = dFull * this.ball.dir.x / this.ball.dir.y;
    let tmpBallPos = new Point(this.ball.pos.x + dPartialX, this.ball.pos.y + dPartial);
    if (!this.isBallInFrontOfPaddleUpDown(player, tmpBallPos)) return 1; /// to do
    this.ball.dir.y *= -1;
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullX - dPartialX), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
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


    console.log('is ball in front of paddle:', this.isBallInFrontOfPaddleSide(player, tmpBallPos));
    let padtmp = new Point(player.pad.pos)
    console.log('paddle(4):', player.pad.);


    if (!this.isBallInFrontOfPaddleSide(player, tmpBallPos)) return 1;
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

  isBallInFrontOfPaddleSide(player: Player, newPos: Point) {
    // check ball points
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

  getCollisionPercentage(player: Player, ballPos: Point) {
    let padCenterPos = player.pad.pos.y + player.pad.height * 0.5;
    let padFullSize = (player.pad.height + this.ball.size) * 0.5;
    return ((ballPos.y - padCenterPos) / padFullSize);
  }

  getCollisionPointSide(player: Player, colPts: CollisionPointsPaddle) {
    let colPt: Point;
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



  scorePoint(winner: number) {
    if (winner === 2) {
      this.pl2.score += 1;
      this.ball.randomService(this.board, 2);
    } else if (winner === 1) {
      this.pl1.score += 1;
      this.ball.randomService(this.board, 1);
    }
    this.ball.pos = new Point(this.board.width * 0.5, this.board.height * 0.5);
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