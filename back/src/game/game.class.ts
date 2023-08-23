import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { PongEvents } from './pong.gateway';
import { CollisionPointsBall, CollisionPointsSides } from './models/collisionPoints.model';
import { copyFileSync } from 'fs';

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

    let ret = this.checkBoxCollisions(newPos);
    if (ret === -1) return;
    this.ball.pos.x = newPos.x;
    this.ball.pos.y = newPos.y;

  }

  checkBoxCollisions(newPos: Point) {
    // Left score
    if (newPos.x - this.ball.halfSize <= 0 && this.ball.dir.x < 0) {
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
    // Paddles
    else {
      let player: Player = this.ball.dir.x < 0 ? this.pl1 : this.pl2;
      this.ball.dir.x < 0 ? player.pad.collisionUpdate(1) : player.pad.collisionUpdate(2);
      let colPt: Point = this.getCollisionPoint(player);

      // console.log('collision pt:', colPt);
      // console.log('ball +hsx:', this.ball.pos.x + this.ball.halfSize,
      // ' newposx:', newPos.x);
      // console.log(' ');

      if (this.ball.dir.x < 0
        && newPos.x - this.ball.halfSize <= colPt.x
        && this.ball.pos.x - this.ball.halfSize >= colPt.x
        && this.isBallInFrontOfPaddle(player, newPos)) {
        this.ball.dir.x *= -1;
      }
      else if (this.ball.dir.x > 0
        && newPos.x + this.ball.halfSize >= colPt.x
        && this.ball.pos.x + this.ball.halfSize <= colPt.x) {
          this.getNewPointAfterCollision(newPos, colPt);
        return -1;
      }

    }
    return 1;
  }

  getNewPointAfterCollision(newPos: Point, colPt: Point) {
    let dPartial = colPt.x - (this.ball.pos.x + this.ball.halfSize);
    let dFull = (newPos.x + this.ball.halfSize) - (this.ball.pos.x + this.ball.halfSize);
    let dPartialY = dPartial * this.ball.dir.y / this.ball.dir.x;
    let dFullY = dFull * this.ball.dir.y / this.ball.dir.x;
    let tmpBall = new Point(
      this.ball.pos.x + dPartial,
      this.ball.pos.y + dPartialY
    );
    this.ball.dir.x *= -1;
    let tmpBall2 = new Point(
      tmpBall.x - (dFull - dPartial),
      tmpBall.y - (dFullY - dPartialY),
    );
    // console.log('tmpBall2 x:', tmpBall2.x, ' y:', tmpBall2.y);
    this.ball.pos = tmpBall2;
  }

  getCollisionPoint(player: Player) {
    let colPt: Point;
    let plColPts = player.pad.colPts;
    let ballColPts = new CollisionPointsBall(this.ball);
    let determinant = ballColPts.a * plColPts.b - ballColPts.b * plColPts.a;
    if (determinant === 0) {
      colPt = new Point(1000000, 1000000);
    } else {
      colPt = new Point(
        (plColPts.b * ballColPts.c - ballColPts.b * plColPts.c) / determinant,
        (ballColPts.a * plColPts.c - plColPts.a * ballColPts.c) / determinant);
    }
    return colPt;
  }

  // isColPointInBall
  isBallInFrontOfPaddle(player: Player, newPos: Point) {
    if ((newPos.y - this.ball.halfSize >= player.pad.pos.y
      && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height))
      return true;
    if ((newPos.y + this.ball.halfSize >= player.pad.pos.y
      && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height))
      return true;
    return false;
  }


  computeCollision(side: string) {
    let sideColPts: CollisionPointsSides;
    const ballColPts = new CollisionPointsBall(this.ball);

    if (side === 'low')
      sideColPts = this.board.lowWall;
    else if (side === 'up')
      sideColPts = this.board.upWall;
    else if (side === 'left')
      sideColPts = this.board.leftWallPaddleCol;
    else if (side === 'right')
      sideColPts = this.board.rightWallPaddleCol;
    const determinant = ballColPts.a * sideColPts.b - sideColPts.a * ballColPts.b;

    // if (this.prints > 0) {
    // console.log('side:', side);
    // console.log('ball a:', ballColPts.a, ' b:', ballColPts.b, ' c:', ballColPts.c);
    // console.log('ball a:', sideColPts.a, ' b:', sideColPts.b, ' c:', sideColPts.c);
    //   this.prints -= 1;
    // }

    if (determinant === 0) {
      return new Point(100000, 100000);
      //do something about it
    } else {
      var x = (sideColPts.b * ballColPts.c - ballColPts.b * sideColPts.c) / determinant;
      var y = (ballColPts.a * sideColPts.c - sideColPts.a * ballColPts.c) / determinant;
    }

    // if (this.prints > 0) {
    // console.log('x:', x, ' y:', y);
    // console.log(' ');
    //   this.prints -= 1;
    // }

    return (new Point(x, y));
  }

  hDistanceInsidePaddel(player: Player, newPos: Point) {
    let vDistance: number;
    let posX: number = this.ball.pos.x < this.board.width * 0.5 ?
      newPos.x - this.ball.halfSize :
      newPos.x + this.ball.halfSize;
    if (this.ball.pos.x < this.board.width * 0.5) {
      if (posX <= player.pad.pos.x + player.pad.width
        && this.ball.dir.x < 0
        && this.isBallInFrontOfPaddle(player, newPos)) {
        // this.ball.dir.x *= -1;
        return player.pad.pos.x + player.pad.width - posX;
      }
    }
    else if (this.ball.pos.x > this.board.width * 0.5) {
      if (posX >= player.pad.pos.x
        && this.ball.dir.x > 0
        && this.isBallInFrontOfPaddle(player, newPos)) {
        // this.ball.dir.x *= -1;
        return posX - player.pad.pos.x;
      }
    }
    return -1;
  }

  vDistanceInsidePaddel(player: Player, newPos: Point) {
    let posY: number = newPos.y + this.ball.halfSize;
    // Up
    if (posY >= player.pad.pos.y
      && this.ball.dir.y > 0
      && this.areBallPointsInPaddleWidth(player, newPos)
      && this.arePaddlePointsInBallWidth(player, newPos)) {
      // this.ball.dir.y *= -1;
      return posY - player.pad.pos.y;
    } else if (posY <= player.pad.pos.y + player.pad.height
      && this.ball.dir.y < 0
      && this.areBallPointsInPaddleWidth(player, newPos)
      && this.arePaddlePointsInBallWidth(player, newPos)) {
      // this.ball.dir.y *= -1;
      return player.pad.pos.y + player.pad.height - posY;
    }
    return -1;
  }

  areBallPointsInPaddleWidth(player: Player, newPos: Point) {
    let ballLeft = { x: newPos.x - this.ball.halfSize, y: newPos.y };
    let ballRight = { x: newPos.x + this.ball.halfSize, y: newPos.y };
    if (ballLeft.x >= player.pad.pos.x
      && ballLeft.x <= player.pad.pos.x + player.pad.width)
      return true;
    if (ballRight.x >= player.pad.pos.x
      && ballRight.x <= player.pad.pos.x + player.pad.width)
      return true;
    return false;
  }

  arePaddlePointsInBallWidth(player: Player, newPos: Point) {
    let padLeft = { x: player.pad.pos.x, y: player.pad.pos.y };
    let padRight = { x: player.pad.pos.x + player.pad.width, y: player.pad.pos.y };
    if (padLeft.x >= this.ball.pos.x - this.ball.halfSize
      && padLeft.x <= this.ball.pos.x + this.ball.halfSize)
      return true;
    if (padRight.x >= newPos.x - this.ball.halfSize
      && padRight.x <= newPos.x + this.ball.halfSize)
      return true;
    return false;
  }



  isPointInPaddleHeight(newPos: Point, playerNum: number) {
    let pl: Player = playerNum === 1 ? this.pl1 : this.pl2;
    let padUp: Point = pl.pad.pos;
    let padLow = { x: pl.pad.pos.x, y: pl.pad.pos.y + pl.pad.height };
    let ballUp = { x: newPos.x, y: newPos.y - this.ball.halfSize };
    let ballLow = { x: newPos.x, y: newPos.y + this.ball.halfSize };
    if (ballLow.y >= padUp.y && ballLow.y < padUp.y + pl.pad.height * 0.5)
      return 'low';
    // console.log('ballUp y:', ballLow.y, ' padMid y:', padUp.y + pl.pad.height * 0.5, ' padUp y:', padLow.y)
    if (ballUp.y >= padUp.y + pl.pad.height * 0.5 && ballUp.y <= padLow.y)
      return 'up';
    return '';
  }

  ballPaddleAreAligned(newPos: Point, playerNum: number) {
    // if (this.areBallPointsInPaddleWidth(newPos, playerNum) || this.arePaddlePointsInBallWidth(newPos, playerNum))
    //   return true;
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

  private updateBallPositionFrame(deltaTime: number) {
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);

    const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);

    if (newPos.y - this.ball.halfSize <= 0 || newPos.y + this.ball.halfSize >= this.board.height) {
      this.ball.dir.y *= -1;
    }
    // Left
    else if (newPos.x - this.ball.halfSize <= 0) {
      this.scoring = false;
      this.scorePoint(2);
      return false;
    }
    // Right
    else if (newPos.x + this.ball.halfSize >= this.board.width) {
      this.scoring = false;
      this.scorePoint(1);
      return false;
    }
    // Paddle collision &
    // No collision update
    else {
      if (this.ballPaddleAreAligned(newPos, 1) || this.ballPaddleAreAligned(newPos, 2)) {
        let playerNum = this.ballPaddleAreAligned(newPos, 1) === true ? 1 : 2;
        let isSideBounce = this.isPointInPaddleHeight(newPos, playerNum);
        if ((isSideBounce === 'low' && this.ball.dir.y > 0)
          || (isSideBounce === 'up' && this.ball.dir.y < 0)) {
          this.ball.dir.y *= -1;
        }


        // console.log('SIDE POTENTIAL COLLISION');
      }
      this.ball.pos.x = newPos.x;
      this.ball.pos.y = newPos.y;
    }
    return true;
  }



  getMinDistCollision() {
    let lowPt = this.computeCollision('low');
    let upPt = this.computeCollision('up');
    let leftPt = this.computeCollision('left');
    let rightPt = this.computeCollision('right');

    let distLow = lowPt.distanceToPointBallSide(this.ball, 'low');
    let distUp = upPt.distanceToPointBallSide(this.ball, 'up');
    let distLeft = leftPt.distanceToPointBallSide(this.ball, 'left');
    let distRight = rightPt.distanceToPointBallSide(this.ball, 'right');

    // if (this.prints > 0) {
    //   console.log('dlow:', distLow, ' dup:', distUp, ' dleft:', distLeft, ' dright:', distRight);
    //   console.log(' ');
    //   this.prints -= 1;
    // }

    let distV: number;
    let collisionV = '';
    if (this.collisionType === 'low') {
      distV = distUp;
      collisionV = 'up';
    } else if (this.collisionType === 'up') {
      distV = distLow;
      collisionV = 'low';
    } else {
      if (this.ball.dir.y >= 0) {
        distV = distLow;
        collisionV = 'low';
      } else {
        distV = distUp;
        collisionV = 'up';
      }
    }

    let distH: number;
    let collisionH = '';
    if (this.collisionType === 'left') {
      distH = distRight;
      collisionH = 'right';
    } else if (this.collisionType === 'right') {
      distH = distLeft;
      collisionH = 'left';
    } else {
      if (this.ball.dir.x >= 0) {
        distH = distRight;
        collisionH = 'right';
      } else {
        distH = distLeft;
        collisionH = 'left';
      }
    }

    if (Math.min(distV, distH) === distV) {
      this.collisionType = collisionV;
      return distV;
    } else {
      this.collisionType = collisionH;
      return distH;
    }
  }

  private handleCollision(distance: number) {
    if (distance === 0) return;
    let collisionPercentage: number;
    let frame = 0;
    if (this.collisionType === 'low') {
      this.ball.dir.y = -this.ball.dir.y;
    } else if (this.collisionType === 'up') {
      this.ball.dir.y = -this.ball.dir.y;
    } else if (this.collisionType === 'left') {
      if (this.checkPaddleCollision()) {
        collisionPercentage = this.getCollisionPercentage();
        this.ball.updateDirectionBounce(collisionPercentage, this.collisionType);
      } else {
        // console.log('BOOOOOOOOOOOOOOOOOOOOOMMMMMMMM 1111111111');
        // this.updateBallPosition(distance);
        // this.sendUpdate();
        this.scoring = true;
        // this.updateScoring(0, true);
        // this.updateScoring(frame, true);
        // await new Promise((resolve) => setTimeout(resolve, 300));
        // this.scorePoint();
      }
    } else if (this.collisionType === 'right') {
      if (this.checkPaddleCollision()) {
        collisionPercentage = this.getCollisionPercentage();
        this.ball.updateDirectionBounce(collisionPercentage, this.collisionType);
      }
      else {
        // console.log('BOOOOOOOOOOOOOOOOOOOOOMMMMMMMM 22222222222222');
        // console.log('ball in handle collision:', this.ball);
        // this.updateBallPosition(distance);
        // this.sendUpdate();
        this.scoring = true;
        // this.updateScoring(0, true);
        // this.updateScoring(frame, true);
        // await new Promise((resolve) => setTimeout(resolve, 300));
        // this.scorePoint();
      }

    }
  }

  private updateScoring(frame: number, isStart: boolean) {
    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.prevFrameTime;

    if (!isStart) {
      frame = Date.now() - frame;
      const ret = this.updateBallPositionFrame(frame);
      if (!ret) {
        // this.updateGame(0);
        return;
      }
      this.sendUpdate();
    }
    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    frame = Date.now();
    isStart = false;
    clearTimeout(this.gameLoopInterval!);
    if (!this.scoring) return;
    this.gameLoopInterval = setTimeout(() => {
      this.updateScoring(frame, isStart);
    }, remainingTime);
    this.prevFrameTime = frameStartTime;
  }





  getCollisionPercentage() {
    let padCenterPos: number;
    let padFullSize: number;
    if (this.collisionType === 'left') {
      padCenterPos = this.pl1.pad.pos.y + this.pl1.pad.height * 0.5;
      padFullSize = (this.pl1.pad.height + this.ball.size) * 0.5;
      return ((this.ball.pos.y - padCenterPos) / padFullSize);
    } else if (this.collisionType === 'right') {
      padCenterPos = this.pl2.pad.pos.y + this.pl2.pad.height * 0.5;
      padFullSize = (this.pl2.pad.height + this.ball.size) * 0.5;
      return ((this.ball.pos.y - padCenterPos) / padFullSize);
    }
  }

  checkPaddleCollision() {
    let pBallUp = this.collisionType === 'left' ?
      new Point(this.ball.pos.x - this.ball.halfSize, this.ball.pos.y - this.ball.halfSize)
      : new Point(this.ball.pos.x + this.ball.halfSize, this.ball.pos.y - this.ball.halfSize);
    let pBallLow = this.collisionType === 'left' ?
      new Point(this.ball.pos.x - this.ball.halfSize, this.ball.pos.y + this.ball.halfSize)
      : new Point(this.ball.pos.x + this.ball.halfSize, this.ball.pos.y + this.ball.halfSize);
    if (this.collisionType === 'left') {
      if ((pBallUp.y > this.pl1.pad.pos.y && pBallUp.y < this.pl1.pad.pos.y + this.pl1.pad.height)
        || (pBallLow.y > this.pl1.pad.pos.y && pBallUp.y < this.pl1.pad.pos.y + this.pl1.pad.height))
        return true;
    } else if (this.collisionType === 'right') {
      if ((pBallUp.y > this.pl2.pad.pos.y && pBallUp.y < this.pl2.pad.pos.y + this.pl2.pad.height)
        || (pBallLow.y > this.pl2.pad.pos.y && pBallUp.y < this.pl2.pad.pos.y + this.pl2.pad.height))
        return true;
    }
    return false;
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
    let frame = 0;
    let start = true;
    this.ball.tRefresh = Date.now();
    if (!this.paddleLoopInterval) {
      this.paddleLoopInterval = setInterval(() => {
        if (!this.scoring) this.updatePlayer(player, frame, start);
      }, 0);
    }
  }

  private updatePlayer(player: Player, frame: number, start: boolean) {
    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.playerPrevFrameTime;
    if (!start)
      frame = Date.now() - frame;
    console.log('ball b4:', this.ball.pos, ' pl b4:', player.pad.pos.y);
    this.updatePlayerPosition(player, frame);
    if (this.scoring === false && !start)
      this.refreshInMotion('paddle');
    console.log('ball aft:', this.ball.pos, ' pl aft:', player.pad.pos.y);
    // if (this.paddleLoopInterval && (!player.isMoving || player.movingDir != 'up')) {
    //   clearInterval(this.paddleLoopInterval); 
    //   this.paddleLoopInterval = null;
    //   return;
    // }
    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    frame = Date.now();
    start = false;
    clearTimeout(this.paddleLoopInterval!);
    this.paddleLoopInterval = setTimeout(() => {
      this.updatePlayer(player, frame, start);
    }, remainingTime);
    this.prevFrameTime = frameStartTime;
  }

  updatePlayerPosition(player: Player, frame: number) {
    let deltaY = player.pad.speed * (frame / 1000);
    if (player.movingDir === 'up') {
      let newPosY = player.pad.pos.y - deltaY;
      if (newPosY < this.ball.size * 2) return;
      player.pad.pos.y = newPosY;
    }

  }


















}


// private startGameLoop() {
//   if (!this.gameLoopInterval) {
//       this.gameLoopInterval = setInterval(() => {
//           this.updateGameLogic();
//       }, 0); // Start with zero delay, game logic will determine the delay
//   }
// }

// private updateGameLogic() {
//   const distanceToPassStartTime = Date.now();
//   const deltaTime = frameStartTime - this.prevFrameTime;

//   // Perform game logic, collision detection, updates, etc.
//   this.updateBallPosition(deltaTime);

//   // Calculate the remaining time until the next frame
//   const frameDuration = 1000 / this.frameRate;
//   const remainingTime = Math.max(frameDuration - (Date.now() - frameStartTime), 0);

//   // Clear the previous frame timeout and set the next frame timeout
//   clearTimeout(this.gameLoopInterval!);
//   this.gameLoopInterval = setTimeout(() => {
//       this.updateGameLogic();
//   }, remainingTime);

//   this.prevFrameTime = frameStartTime;
// }




  // private updateGameShort(frame) {

  //   const frameStartTime = Date.now();
  //   if (this.first === true) {
  //     this.updateBallPositionLong(frame);
  //     this.first = false;
  //   } else {
  //     const deltaTime = frameStartTime - this.prevFrameTime;
  //     this.updateBallPositionShort(deltaTime);
  //   }
  //   this.sendUpdate();

  //   if (Date.now() - this.prop.tStart <= 8 * 1000)
  //     console.log('Short x:', this.ball.pos.x, ' y:', this.ball.pos.y);

  //   const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
  //   this.prevFrameTime = frameStartTime;
  //   clearTimeout(this.gameLoopInterval!);
  //   this.gameLoopInterval = setTimeout(() => {
  //     // this.prevFrameTime
  //     this.updateGameShort(frame);
  //   }, remainingTime);

  // }


    // private detectCollision(newPos: Point) {
  //   if (newPos.x - this.ball.halfSize <= 0)
  //     return 'L';
  //   else if (newPos.x + this.ball.halfSize >= this.board.width)
  //     return 'R';
  //   else if (newPos.y - this.ball.halfSize <= 0)
  //     return 'up';
  //   else if (newPos.y + this.ball.halfSize >= this.board.height)
  //     return 'low';
  //   return 'none';
  // }





    // private updateBallPositionShort(deltaTime: number) {
  //   // Calculate new position based on current speed and direction
  //   const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
  //   const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);

  //   const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);
  //   const collision = this.detectCollision(newPos);
  //   if (collision !== 'none') {
  //     // Handle collision: calculate new direction and update ball properties
  //     this.handleCollision(collision);
  // } else {
  //     // No collision, update ball position
  //     this.ball.pos.x += deltaX;
  //     this.ball.pos.y += deltaY;
  // }

  //   // const checkCollision()
  //   this.ball.pos.x += deltaX;
  //   this.ball.pos.y += deltaY;
  //   // Update the ball's tip based on the new position
  //   // Check for collisions, scoring, or other game logic involving the ball
  // }



  // startGameLoop() {
  //   let frame = 0;
  //   if (!this.gameLoopInterval) {
  //     // const frameDuration = 1000 / this.frameRate;

  //     this.gameLoopInterval = setInterval(() => {
  //       this.updateGameLong(frame);
  //       // this.updateBallPosition(frameDuration);

  //       // You can add more game logic here
  //       // if (Date.now() - this.prop.tStart < 5 * 1000)
  //       //   console.log('ballx:', this.ball.pos.x, ' bally:', this.ball.pos.y);
  //     }, 0);
  //     // }, frameDuration);
  //   }
  // }





















  ////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////

  // checkBoxCollisions(newPos: Point) {
  //   // Left score
  //   if (newPos.x - this.ball.halfSize <= 0 && this.ball.dir.x < 0) {
  //     this.scorePoint(2);
  //     return -1;
  //   }
  //   // Right score
  //   else if (newPos.x + this.ball.halfSize >= this.board.width && this.ball.dir.x > 0) {
  //     this.scorePoint(1);
  //     return -1;
  //   }
  //   // Up and Low Wall
  //   else if ((newPos.y - this.ball.halfSize <= 0 && this.ball.dir.y < 0)
  //     || (newPos.y + this.ball.halfSize >= this.board.height && this.ball.dir.y > 0))
  //     this.ball.dir.y *= -1;
  //   // Paddles
  //   else {
  //     // vertical
  //     let player: Player = this.ball.pos.x < this.board.width * 0.5 ? this.pl1 :
  //       this.ball.pos.x > this.board.width * 0.5 ? this.pl2 : null;
  //     if (player === null) return;
  //     let hInside = this.hDistanceInsidePaddel(player, newPos);
  //     let vInside = this.vDistanceInsidePaddel(player, newPos);

  //     // horizontal
  //     // if (this.ballPaddleAreAligned(newPos, 1) || this.ballPaddleAreAligned(newPos, 2)) {
  //     //   let playerNum = this.ballPaddleAreAligned(newPos, 1) === true ? 1 : 2;
  //     //   let isSideBounce = this.isPointInPaddleHeight(newPos, playerNum);
  //     //   if ((isSideBounce === 'low' && this.ball.dir.y > 0)
  //     //     || (isSideBounce === 'up' && this.ball.dir.y < 0)) {
  //     //     this.ball.dir.y *= -1;
  //     //   }
  //     // }
  //   }
  //   return 1;
  // }

  // vDistanceInsidePaddel(player: Player, newPos: Point) {
  //   // Up
  //   if (newPos.y + this.ball.halfSize >= player.pad.pos.x
  //     && this.ball.dir.y > 0
  //     && this.areBallPointsInPaddleWidth(player, newPos)) {
  //     this.ball.dir.x *= -1;
  //     return player.pad.pos.x + player.pad.width - newPos.x - this.ball.halfSize;
  //   }
  //   // Right side - player 2
  //   // else if (this.ball.pos.x > this.board.width * 0.5) {
  //   //   player = this.pl2;
  //   //   if (newPos.x + this.ball.halfSize >= player.pad.pos.x
  //   //     && this.ball.dir.x > 0
  //   //     && this.isBallInFrontOfPaddle(player, newPos)) {
  //   //     this.ball.dir.x *= -1;
  //   //     return newPos.x + this.ball.halfSize - player.pad.pos.x;
  //   //   }
  //   // }
  //   return -1;
  // }

  // hDistanceInsidePaddel(player: Player, newPos: Point) {
  //   let vDistance: number;
  //   let posX: number = this.ball.pos.x < this.board.width * 0.5 ?
  //     newPos.x - this.ball.halfSize :
  //     newPos.x + this.ball.halfSize;

  //   if (posX <= player.pad.pos.x + player.pad.width
  //     && this.ball.dir.x < 0
  //     && this.isBallInFrontOfPaddle(player, newPos)) {
  //     this.ball.dir.x *= -1;
  //     vDistance = this.ball.pos.x < this.board.width * 0.5 ?
  //       player.pad.pos.x + player.pad.width - newPos.x - this.ball.halfSize :
  //       newPos.x + this.ball.halfSize - player.pad.pos.x;
  //     return vDistance;
  //   }
  //   return -1;
  // }

  // isBallInFrontOfPaddle(player: Player, newPos: Point) {
  //   if ((newPos.y - this.ball.halfSize >= player.pad.pos.y
  //     && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height))
  //     return true;
  //   if ((newPos.y + this.ball.halfSize >= player.pad.pos.y
  //     && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height))
  //     return true;
  //   return false;
  // }

  // isPointInPaddleHeight(newPos: Point, playerNum: number) {
  //   let pl: Player = playerNum === 1 ? this.pl1 : this.pl2;
  //   let padUp: Point = pl.pad.pos;
  //   let padLow = { x: pl.pad.pos.x, y: pl.pad.pos.y + pl.pad.height };
  //   let ballUp = { x: newPos.x, y: newPos.y - this.ball.halfSize };
  //   let ballLow = { x: newPos.x, y: newPos.y + this.ball.halfSize };
  //   if (ballLow.y >= padUp.y && ballLow.y < padUp.y + pl.pad.height * 0.5)
  //     return 'low';
  //   // console.log('ballUp y:', ballLow.y, ' padMid y:', padUp.y + pl.pad.height * 0.5, ' padUp y:', padLow.y)
  //   if (ballUp.y >= padUp.y + pl.pad.height * 0.5 && ballUp.y <= padLow.y)
  //     return 'up';
  //   return '';
  // }

  // areBallPointsInPaddleWidth(player: Player, newPos: Point) {
  //   let ballLeft = { x: newPos.x - this.ball.halfSize, y: newPos.y };
  //   let ballRight = { x: newPos.x + this.ball.halfSize, y: newPos.y };
  //   if (ballLeft.x >= player.pad.pos.x
  //     && ballLeft.x <= player.pad.pos.x + player.pad.width)
  //     return true;
  //   if (ballRight.x >= player.pad.pos.x
  //     && ballRight.x <= player.pad.pos.x + player.pad.width)
  //     return true;
  //   return false;
  // }

  // arePaddlePointsInBallWidth(newPos: Point, playerNum: number) {
  //   let pl: Player = playerNum === 1 ? this.pl1 : this.pl2;
  //   let padLeft = { x: this.pl1.pad.pos.x, y: this.pl1.pad.pos.y };
  //   let padRight = { x: this.pl1.pad.pos.x + this.pl1.pad.width, y: this.pl1.pad.pos.y };
  //   if (padLeft.x >= this.ball.pos.x - this.ball.halfSize && padLeft.x <= this.ball.pos.x + this.ball.halfSize)
  //     return true;
  //   if (padRight.x >= newPos.x - this.ball.halfSize && padRight.x <= newPos.x + this.ball.halfSize)
  //     return true;
  //   return false;
  // }








        // let player: Player = this.ball.pos.x < this.board.width * 0.5 ?
      //   this.pl1 :
      //   this.ball.pos.x > this.board.width * 0.5 ? this.pl2 : null;
      // if (player === null) return;
      // let hInside = this.hDistanceInsidePaddel(player, newPos);
      // // const vInside = -1;
      // let vInside = this.vDistanceInsidePaddel(player, newPos);
      // console.log('h:', hInside, ' v:', vInside, ' limit:', Math.abs(this.ball.speed * this.ball.dir.x));
      // if (hInside !== -1 && hInside <= Math.abs(this.ball.speed * this.ball.dir.x)) {
      //   this.ball.dir.x *= -1;
      //   return -1;
      // }

      // if (hInside >= vInside && hInside !== -1) { // fine tune
      //   this.ball.dir.x *= -1;
      // } else if (hInside < vInside) {
      //   this.ball.dir.y *= -1;
      // }