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
import { PongService } from './pong.service';
import { User } from '@prisma/client';

export interface GameParams {
  pl1: Player;
  pl2: Player;
  ball: Ball;
}

export class GameStruct {
  public gameMode: number;
  public prop: GameProperties;
  public board: Board;
  public ball: Ball;
  public pl1: Player;
  public pl2: Player;
  public winner: Player | null;
  public loser: Player | null;

  public prevFrameTime = 0;

  private readonly updateInterval: number = 100; // Adjust as needed
  private updateIntervalId: NodeJS.Timeout | null = null;
  private readonly frameRate: number = 60; // 1 / s
  private readonly frameDuration: number = 1000 / this.frameRate; // s
  private gameLoopInterval: NodeJS.Timeout | null = null;

  constructor(gameMode: number, id: number, pl1Id: number, pl2Id: number, room: string,
    private pongEvents: PongEvents,
    private pongService: PongService) {
    this.gameMode = gameMode;
    this.prop = new GameProperties(id, room);
    this.board = new Board();
    this.ball = new Ball(this.board, gameMode);
    this.pl1 = new Player(this.board, gameMode, pl1Id, 1);
    this.pl2 = new Player(this.board, gameMode, pl2Id, 2);
    this.winner = null;
    this.loser = null;
    this.board.updatePointsAndCollisionParameters(this.pl1.pad);
  }

  async startGameLoop() {
    let isStart = true;
    // if (!this.gameLoopInterval) {
    //   this.gameLoopInterval = setInterval(() => {
    await this.updateGame(isStart);

    //   }, 0);
    // }
  }

  private async updateGame(isStart: boolean) {
    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.prevFrameTime;
    if (!isStart)
      this.updateBallPosition(deltaTime);
    isStart = false;
    this.sendUpdateToRoom('playing', 'playing', -1, 'refreshGame');
    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    if (this.prop.status === 'ended') {
      this.sendUpdateToRoom('playing', 'playing', -1, 'refreshGame');
      if (this.winner && this.loser) {
        await this.pongService.endGame(this, this.winner, this.loser);
        this.pongEvents.updateEmitOnlineGames('toRoom', 0);
      }
      return;
    }
    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.updateGame(isStart);
    }, remainingTime);
    this.prevFrameTime = frameStartTime;
  }

  private updateBallPosition(deltaTime: number) {
    // console.log(' ');
    // console.log('0 ball(1):', this.ball.getBallPoint(1));
    // console.log('ball speed:', this.ball.speed);
    // console.log('ball speedBackup:', this.ball.speedBackup); 
    this.pl1.pad.posPrev = new Point(this.pl1.pad.pos.x, this.pl1.pad.pos.y);
    this.updatePlayers(deltaTime);
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);
    // console.log('1 ball(1):', this.ball.getBallPoint(1));
    const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);
    let ret = this.checkBoxCollisions(newPos);
    // console.log('2 ball(1):', this.ball.getBallPoint(1));
    if (ret === -1) return;
    this.ball.pos.x = newPos.x;
    this.ball.pos.y = newPos.y;
    // console.log('3 ball(1):', this.ball.getBallPoint(1));
  }

  updatePlayers(deltaTime: number) {
    // Player 1
    if (this.pl1.isMoving && this.pl1.movingDir === 'up') {
      // console.log('UPPPPPPPPPPPPPPPPP PLAYER');
      // console.log('BALL POS IN y (4):', this.ball.getBallPoint(4));
      // console.log('BALL POS IN y (2):', this.ball.getBallPoint(2));
      let pad = this.pl1.pad;
      // console.log('padPos(3):', pad.pos.y);
      let newPos = new Point(pad.pos.x, pad.pos.y - pad.speed * (deltaTime / 1000));
      if (newPos.y < this.ball.size * 2)
        newPos.y = this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;

      let pptmp = new Point(padPosPrev.x, padPosPrev.y);
      let nptmp = new Point(newPos.x, newPos.y);
      // console.log('bpos(4):', this.ball.pos.y + this.ball.halfSize);   
      // console.log('padPrev y:', pptmp.y);
      // console.log('padNew y:', nptmp.y);
      // console.log('union now:', this.ballAndPaddleUnionDown(newPos, pad));
      // console.log('union prev:', this.ballAndPaddleUnionDown(padPosPrev, pad));


      if (this.ballAndPaddleUnionUp(newPos, pad)
        && !this.ballAndPaddleUnionUp(padPosPrev, pad)) {
        // console.log('triggered!!!!!!!!!!!!!!!!!!!');
        this.ball.pos.y = newPos.y - this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y > 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
        // console.log('ball after:', this.ball.pos);
      }
    } else if (this.pl1.isMoving && this.pl1.movingDir === 'down') {
      // console.log(' ');
      // console.log('DOWNNNNNNNNNNNNNNNNNNNNNNNNNNNNN PLAYER');
      // console.log('BALL POS IN y (1):', this.ball.getBallPoint(1));
      // console.log('BALL POS IN y (2):', this.ball.getBallPoint(2));
      let pad = this.pl1.pad;
      // console.log('Pad low(4) b4:', new Point(pad.pos.x + pad.width, pad.pos.y + pad.height));
      // console.log('padPos(3):',  pad.pos.y + pad.height);
      let newPos = new Point(pad.pos.x, pad.pos.y + pad.speed * (deltaTime / 1000));
      // console.log('Pad low(4) new:', new Point(newPos.x + pad.width, newPos.y + pad.height));
      // console.log('pad newPos (3):',  newPos.y + pad.height);
      if (newPos.y > this.board.height - pad.height - this.ball.size * 2)
        newPos.y = this.board.height - pad.height - this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      // let pptmp = new Point(padPosPrev.x, padPosPrev.y + pad.height);
      // let nptmp = new Point(newPos.x, newPos.y + pad.height);
      // console.log('bpos(1):', this.ball.pos.y - this.ball.halfSize);   
      // console.log('padPrev y:', pptmp.y);
      // console.log('padNew y:', nptmp.y);
      // console.log('union now:', this.ballAndPaddleUnionDown(newPos, pad));
      // console.log('union prev:', this.ballAndPaddleUnionDown(padPosPrev, pad));
      if (this.ballAndPaddleUnionDown(newPos, pad)
        && !this.ballAndPaddleUnionDown(padPosPrev, pad)) {
        // console.log('triggered!!!!!!!!!!!!!!!!!!!');
        this.ball.pos.y = newPos.y + pad.height + this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y < 0 ? -this.ball.dir.y : this.ball.dir.y;
        // console.log('ball after:', this.ball.pos);
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
      }
      // console.log('BALL POS OUT (4):', this.ball.getBallPoint(4), ' dir:', this.ball.dir);
    }
    // Player 2
    if (this.pl2.isMoving && this.pl2.movingDir === 'up') {
      let pad = this.pl2.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y - pad.speed * (deltaTime / 1000));
      if (newPos.y < this.ball.size * 2)
        newPos.y = this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionUp(newPos, pad)
        && !this.ballAndPaddleUnionUp(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y - this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y > 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
      }
    } else if (this.pl2.isMoving && this.pl2.movingDir === 'down') {
      let pad = this.pl2.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y + pad.speed * (deltaTime / 1000));
      if (newPos.y > this.board.height - pad.height - this.ball.size * 2)
        newPos.y = this.board.height - pad.height - this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionDown(newPos, pad)
        && !this.ballAndPaddleUnionDown(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y + pad.height + this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y < 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
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
    let posDownLeft = new Point(pos.x, pos.y + pad.height);
    let posDownRight = new Point(pos.x + pad.width, pos.y + pad.height);
    // console.log('__UNION__');
    // console.log('')
    // console.log('pos:', pos);
    // console.log('posDownLeft:', posDownLeft);
    // console.log('posDownLeft:', posDownRight);
    // console.log('this.isPointInBall(posDownLeft):', this.isPointInBall(posDownLeft));
    // console.log('this.isPointInBall(posDownRight):', this.isPointInBall(posDownRight));
    // console.log('this.isPointInNewPaddle(this.ball.getBallPoint(2), pad, pos):', this.isPointInNewPaddle(this.ball.getBallPoint(2), pad, pos));
    // console.log('this.isPointInNewPaddle(this.ball.getBallPoint(1), pad, pos):', this.isPointInNewPaddle(this.ball.getBallPoint(1), pad, pos));
    // if (this.isPointInBall(new Point(posDownLeft.x + pad.width, posDownLeft.y)))
    //   return true;

    if ((this.isPointInBall(posDownLeft)
      || this.isPointInBall(new Point(posDownLeft.x + pad.width, posDownLeft.y)))
      || (this.isPointInNewPaddle(this.ball.getBallPoint(2), pad, pos)
        || this.isPointInNewPaddle(this.ball.getBallPoint(1), pad, pos)))
      return true;
    return false;
  }

  isPointInBall(p: Point) {
    let b = this.ball;
    // console.log('Is point in ball?');
    // console.log(p.x, '>',  b.getBallPoint(1).x);
    // console.log(p.x, '<', b.getBallPoint(2).x);
    // console.log(p.y , '>',  b.getBallPoint(1).x);
    // console.log(p.y, '<',  p.y < b.getBallPoint(4).y);

    if (!(p.x > b.getBallPoint(1).x && p.x < b.getBallPoint(2).x))
      return false;
    if (!(p.y > b.getBallPoint(1).y && p.y < b.getBallPoint(4).y))
      return false;
    return true;
  }

  isPointInNewPaddle(p: Point, pad: Paddle, newPos: Point) {
    if (!(p.x > newPos.x && p.x < newPos.x + pad.width))
      return false;
    if (!(p.y > newPos.y && p.y < newPos.y + pad.height))
      return false;
    return true;
  }

  checkBoxCollisions(newPos: Point) {
    // Left score
    let value = 1;
    if (newPos.x - this.ball.halfSize <= 0 && this.ball.dir.x < 0) {
      // console.log('SCORE');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      this.scorePoint(2);
      return -1;
    }
    // Right score
    else if (newPos.x + this.ball.halfSize >= this.board.width && this.ball.dir.x > 0) {
      // console.log('SCORE');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      // console.log(' ');
      this.scorePoint(1);
      return -1;
    }
    // Up and Low Wall collisions
    else if ((newPos.y - this.ball.halfSize <= 0 && this.ball.dir.y < 0)
      || (newPos.y + this.ball.halfSize >= this.board.height && this.ball.dir.y > 0)) {
      this.ball.dir.y *= -1;
      this.ball.accelerateBall(1);
    }
    else {
      // Paddles
      let player: Player = this.ball.dir.x < 0 ? this.pl1 : this.pl2;
      let colPtsSide;
      // if (this.ball.dir.x < 0) {
      //   let colPtsSide = player.pad.collisionUpdate(1);
      // } else {

      // }
      this.ball.dir.x < 0 ? player.pad.collisionUpdate(1) : player.pad.collisionUpdate(2);
      let colPtSide: Point = this.getCollisionPointSide(player, player.pad.colPtsSide);
      let colPtUp: Point = this.getCollisionPointSide(player, player.pad.colPtsUp);
      let colPtDown: Point = this.getCollisionPointSide(player, player.pad.colPtsDown);
      colPtSide.round();


      // console.log('___CHECKBOX VERIF____');
      // console.log('ball dir y:', this.ball.dir.y);
      // console.log('ball pos(4):', this.ball.getBallPoint(4));
      // console.log('newpos (4):', new Point(newPos.x - this.ball.halfSize, newPos.y + this.ball.halfSize));
      // console.log('paddle y up:', player.pad.pos.y);
      // console.log('colPtUp:', colPtUp);
      // console.log(newPos.y + this.ball.halfSize, '>=', colPtUp.y);
      // console.log(this.ball.pos.y + this.ball.halfSize, '<=', colPtUp.y);

      // Left
      // console.log('-> letf');
      if (this.ball.dir.x < 0
        && newPos.x - this.ball.halfSize <= colPtSide.x
        && this.ball.pos.x - this.ball.halfSize >= colPtSide.x) {
        // console.log('-> Left');
        // console.log('colPt:', colPtSide);
        // console.log('ball:', this.ball.getBallPoint(1));
        // console.log('newPos:', new Point(newPos.x - this.ball.halfSize, newPos.y - this.ball.halfSize));
        // console.log('padPos(3):', new Point(player.pad.pos.x + player.pad.width, player.pad.pos.y + player.pad.height));
        if (this.getNewPointAfterCollisionSide(player, newPos, colPtSide) === -1)
          return -1;
        // console.log('ball after left:', this.ball.pos);
        // console.log('ball 3 after left:', this.ball.getBallPoint(3));
        // return this.getNewPointAfterCollisionSide(player, newPos, colPtSide);
      }
      // console.log('-> right');
      // Right
      if (this.ball.dir.x > 0
        && newPos.x + this.ball.halfSize >= colPtSide.x
        && this.ball.pos.x + this.ball.halfSize <= colPtSide.x) {
        // console.log('-> RIGHT');
        if (this.getNewPointAfterCollisionSide(player, newPos, colPtSide) === -1)
          return -1;
      }
      // Up
      // console.log('-> up:');
      if (this.ball.dir.y > 0
        && newPos.y + this.ball.halfSize >= colPtUp.y
        && this.ball.pos.y + this.ball.halfSize <= colPtUp.y) {
        // console.log('-> UP:');
        // console.log('colPt:', colPtUp);
        // console.log('ball pos 4:', this.ball.getBallPoint(4));
        // console.log('newPos 4:', new Point(newPos.x - this.ball.halfSize, newPos.y + this.ball.halfSize));
        colPtUp.round();

        if (this.getNewPointAfterCollisionUpDown(player, newPos, colPtUp) === -1)
          return -1;
      }
      // Down
      // console.log('-> down:');
      if (this.ball.dir.y < 0
        && newPos.y - this.ball.halfSize <= colPtDown.y
        && this.ball.pos.y - this.ball.halfSize >= colPtDown.y) {
        colPtDown.round();
        // console.log('-> DOWN:', this.getNewPointAfterCollisionUpDown(player, newPos, colPtDown));
        // console.log('-> DOWN:');
        // console.log('colPt:', colPtDown);
        // console.log('ball:', this.ball.getBallPoint(1));
        // console.log('newPos:', new Point(newPos.x - this.ball.halfSize, newPos.y - this.ball.halfSize));
        if (this.getNewPointAfterCollisionUpDown(player, newPos, colPtDown) === -1)
          return -1;
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
    // console.log(' ');
    // console.log('ballPosY:', ballPosY, ' and colpty:', colPt.y);
    let dPartial = colPt.y - ballPosY;
    // console.log('dPartial:', dPartial);
    let newPosY = this.ball.pos.y < player.pad.pos.y ?
      newPos.y + this.ball.halfSize : newPos.y - this.ball.halfSize;
    // console.log('newPosY:', newPosY);
    let dFull = newPosY - ballPosY;
    // console.log('dFull:', dFull);
    let dPartialX = dPartial * this.ball.dir.x / this.ball.dir.y;
    let dFullX = dFull * this.ball.dir.x / this.ball.dir.y;
    let tmpBallPos = new Point(this.ball.pos.x + dPartialX, this.ball.pos.y + dPartial);
    tmpBallPos.round();
    // console.log('is ball in front of paddle UpDown:', this.isBallInFrontOfPaddleSide(player, tmpBallPos));
    let padtmp = new Point(player.pad.pos.x + player.pad.width, player.pad.pos.y);
    // console.log('paddle(4):', padtmp);
    // console.log('balltmp(1)', new Point(tmpBallPos.x - this.ball.halfSize, tmpBallPos.y - this.ball.halfSize));

    if (!this.isBallInFrontOfPaddleUpDown(player, tmpBallPos)) return 1; /// to do
    this.ball.dir.y *= -1;
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullX - dPartialX), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
    this.ball.pos = tmpBall2;
    this.ball.accelerateBall(this.gameMode);
    return -1;
  }

  isBallInFrontOfPaddleUpDown(player: Player, newPos: Point) {
    // Check ball points
    let border = 2;
    let newPoint = new Point(newPos.x, newPos.y);
    // newPoint.round()
    if ((newPos.x - this.ball.halfSize >= player.pad.pos.x - border
      && newPos.x - this.ball.halfSize <= player.pad.pos.x + player.pad.width + border))
      return true;
    if ((newPos.x + this.ball.halfSize >= player.pad.pos.x - border
      && newPos.x - this.ball.halfSize <= player.pad.pos.x + player.pad.width + border))
      return true;
    // Check paddle points
    if ((player.pad.pos.x >= newPos.x - this.ball.halfSize - border)
      && (player.pad.pos.x <= newPos.x + this.ball.halfSize + border))
      return true;
    if ((player.pad.pos.x + player.pad.width >= newPos.x - this.ball.halfSize - border)
      && (player.pad.pos.x + player.pad.width <= newPos.x + this.ball.halfSize + border))
      return true;
    return false;
  }

  getNewPointAfterCollisionSide(player: Player, newPos: Point, colPt: Point) {
    let ballPosX = this.ball.dir.x < 0 ? this.ball.pos.x - this.ball.halfSize : this.ball.pos.x + this.ball.halfSize;
    // console.log('ballPosX:', ballPosX);
    let newPosX = this.ball.dir.x < 0 ? newPos.x - this.ball.halfSize : newPos.x + this.ball.halfSize;
    // console.log('newPosX:', newPosX);
    let dPartial = colPt.x - ballPosX;
    // console.log('dPartial:', dPartial);
    let dFull = newPosX - ballPosX;
    // console.log('dFull:', dFull);
    let dPartialY = dPartial * this.ball.dir.y / this.ball.dir.x;
    let dFullY = dFull * this.ball.dir.y / this.ball.dir.x;

    let tmpBallPos = new Point(this.ball.pos.x + dPartial, this.ball.pos.y + dPartialY);
    tmpBallPos.round();


    // console.log('is ball in front of paddle Side:', this.isBallInFrontOfPaddleSide(player, tmpBallPos));
    let padtmp = new Point(player.pad.pos.x + player.pad.width, player.pad.pos.y + player.pad.height);
    // console.log('paddle(4):', padtmp);
    // console.log('balltmp', new Point(tmpBallPos.x - this.ball.halfSize, tmpBallPos.y - this.ball.halfSize));
    if (!this.isBallInFrontOfPaddleSide(player, tmpBallPos)) return 1;
    // console.log('WE HEEEEEEEEEEEEEERREEEE OKKKKKKKK');
    let colPercentage = this.getCollisionPercentage(player, tmpBallPos);
    this.ball.updateDirectionBounce(colPercentage);
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullY - dPartialY), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
    this.ball.pos = tmpBall2;
    this.ball.accelerateBall(this.gameMode);
    return -1;
  }

  isBallInFrontOfPaddleSide(player: Player, newPos: Point) {
    // check ball points
    // console.log('___IN FRONT OF?___');
    // console.log(newPos.y - this.ball.halfSize, '>=', player.pad.pos.y);
    // console.log(newPos.y - this.ball.halfSize, '<=', player.pad.pos.y + player.pad.height);
    if ((newPos.y - this.ball.halfSize >= player.pad.pos.y - 2
      && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height + 2))
      return true;
    // console.log(' ');
    // console.log(newPos.y + this.ball.halfSize, '>=', player.pad.pos.y -1);
    // console.log(newPos.y + this.ball.halfSize, '<=', player.pad.pos.y + player.pad.height + 1);
    if ((newPos.y + this.ball.halfSize >= player.pad.pos.y - 2
      && newPos.y + this.ball.halfSize <= player.pad.pos.y + player.pad.height + 2))
      return true;

    // Check paddle points
    if ((player.pad.pos.y >= newPos.y - this.ball.halfSize - 2)
      && (player.pad.pos.y <= newPos.y + this.ball.halfSize + 2))
      return true;
    if ((player.pad.pos.y + player.pad.height >= newPos.y - this.ball.halfSize - 2)
      && (player.pad.pos.y + player.pad.height <= newPos.y + this.ball.halfSize + 2))
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
    // console.log('',);
    // console.log('----_>>>> ball pos:', this.ball.pos);
    // console.log('ball dir:', this.ball.dir);
    // console.log('ball col Pts:', ballColPts);
    // console.log('player pad pos (1):', player.pad.pos);
    // console.log('side col Pts:', colPts);
    let determinant = ballColPts.a * colPts.b - ballColPts.b * colPts.a;
    if (determinant === 0) {
      colPt = new Point(1000000, 1000000);
    } else {
      colPt = new Point(
        (colPts.b * ballColPts.c - ballColPts.b * colPts.c) / determinant,
        (ballColPts.a * colPts.c - colPts.a * ballColPts.c) / determinant);
      // console.log('COL PT FINAL:', colPt);
    }
    return colPt;
  }

  scorePoint(winner: number) {
    // set to 11
    let maxScore = 11;

    if (winner === 2) {
      this.pl2.score += 1;
      this.ball.randomService(this.board, 2, this.gameMode);
      // this.ball.pos = new Point(120, 190);
    } else if (winner === 1) {
      this.pl1.score += 1;
      this.ball.randomService(this.board, 1, this.gameMode);
    }
    this.sendUpdateToRoom('playing', 'playing', -1, 'refreshGame');
    this.pongEvents.updateEmitOnlineGames('toRoom', 0);
    if (this.pl1.score >= maxScore || this.pl2.score >= maxScore) {
      this.winner = this.pl1.score >= maxScore ? this.pl1 : this.pl2;
      this.loser = this.pl1.score >= maxScore ? this.pl2 : this.pl1;
      this.winner.isWinner = true;
      this.stopGameLoop();
      this.prop.status = 'ended';
    }
    if (this.gameMode === 2) {
      this.pl1.pad.resetPaddleTop(this.board);
      this.pl1.pad.randomInitializer(this.board, 1);
      this.pl2.pad.resetPaddleTop(this.board);
      this.pl2.pad.randomInitializer(this.board, 2);
    }
    // console.log('ball size:', this.ball.size, ' speed:', this.ball.speed);
    // console.log('pl1 ph:', this.pl1.pad.height, ' pw:', this.pl1.pad.width);
    // console.log('pl2 ph:', this.pl2.pad.height, ' pw:', this.pl2.pad.width);
    // this.ball.pos = new Point(this.board.width * 0.5, this.board.height * 0.5);
    // this.ball.pos = new Point(140, 80);
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

  sendUpdateToRoom(playerStatus: string, opponentStatus: string, countdown: number, channel: string) {
    let countdownStr: string | number = countdown === 0 ? 'GO' : countdown;
    this.pongEvents.server.to(this.prop.room).emit(channel,
      {
        gameStatus: this.prop.status,
        gameParams: this.getState(),
        playerStatus: playerStatus,
        opponentStatus: opponentStatus,
        time: Date.now(),
        countdown: countdownStr,
      });
  }

  sendUpdateToPlayer(player: Player, opponentStatus: string, countdown: number, channel:string) {
    let countdownStr: string | number = countdown === 0 ? 'GO' : countdown;
    this.pongEvents.server.to(`user_${player.id}`).emit(channel,
      {
        gameStatus: this.prop.status,
        gameParams: this.getState(),
        playerStatus: player.status,
        opponentStatus: opponentStatus,
        time: Date.now(),
        countdown: countdownStr,
      });
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