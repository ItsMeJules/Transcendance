import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { PongEvents } from './pong.gateway';
import { CollisionPointsBall, CollisionPointsSides } from './models/collisionPoints.model';

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
  public first = true;
  public scoring = false;
  public collisionType = '';
  public prints = 12 * 4;

  private readonly updateInterval: number = 100; // Adjust as needed
  private updateIntervalId: NodeJS.Timeout | null = null;
  private readonly frameRate: number = 60; // 1 / s
  private readonly frameDuration: number = 1000 / this.frameRate; // s
  private gameLoopInterval: NodeJS.Timeout | null = null;

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
    let distanceToPass = 0;
    this.ball.tRefresh = Date.now();
    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {
        if (!this.scoring)
          this.updateGame(distanceToPass);
        if (this.scoring)
          this.updateScoring(0, true);
      }, 0);
    }
  }

  computeCollision(side: string) {
    let sideColPts: CollisionPointsSides;
    const ballColPts = new CollisionPointsBall(this.ball, side);

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
    //   console.log('side:', side);
    //   console.log('ball a:', ballColPts.a, ' b:', ballColPts.b, ' c:', ballColPts.c);
    //   console.log('ball a:', sideColPts.a, ' b:', sideColPts.b, ' c:', sideColPts.c);
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
    //   console.log('x:', x, ' y:', y);
    //   console.log(' ');
    //   this.prints -= 1;
    // }

    return (new Point(x, y));
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

  private updateGame(distanceToPass) {
    // if (this.prints > 0) {
    //   // console.log('ball before:', this.ball);
    //   console.log('pad1 before:', this.pl1.pad);
    //   console.log(' ');
    //   this.prints -= 1;
    // }
    this.updateBallPosition(distanceToPass);
    this.handleCollision(distanceToPass);
    this.sendUpdate();
    // if (this.prints > 0) {
    //   console.log('ball mid:', this.ball);
    //   console.log(' ');
    //   this.prints -= 1;
    // }
    const distanceToPoint = this.getMinDistCollision();
    const timeToCollision = distanceToPoint / this.ball.speed * 1000;
    distanceToPass = distanceToPoint;
    // if (this.prints > 0) {
    //   console.log('ball after:', this.ball);
    //   console.log('distance:', distanceToPoint);
    //   console.log('direction:', this.collisionType);
    //   console.log('----------------------------------------');
    //   console.log('----------------------------------------');
    //   this.prints -= 1;
    // }
    console.log('>>>>>> this scoring:', this.scoring);
    if (this.scoring) return;
    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.updateGame(distanceToPass);
    }, timeToCollision);
  }

  private updateBallPosition(distance: number) {
    // const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    // const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);
    this.ball.pos.x += distance * this.ball.dir.x;
    this.ball.pos.y += distance * this.ball.dir.y;
    this.ball.tRefresh = Date.now();
  }

  private handleCollision(distance: number) {
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
        // this.updateBallPosition(distance);
        // this.sendUpdate();
        this.scoring = true;
        this.updateScoring(0, true);
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
        console.log('ball in handle collision:', this.ball);
        // this.updateBallPosition(distance);
        // this.sendUpdate();
        this.scoring = true;
        this.updateScoring(0, true);
        // this.updateScoring(frame, true);
        // await new Promise((resolve) => setTimeout(resolve, 300));
        // this.scorePoint();
      }

    }
  }

  private updateScoring(frame: number, isStart: boolean) {
    console.log('Update scoring into');

    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.prevFrameTime;

    if (!isStart) {
      frame = Date.now() - frame;
      this.updateBallPositionFrame(frame);
      this.sendUpdate();
    } else {
      console.log('ball first:', this.ball);
    }


    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    frame = Date.now();
    console.log('remainng time:', remainingTime);
    isStart = false;
    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.updateScoring(frame, isStart);
    }, remainingTime);
    this.prevFrameTime = frameStartTime;

  }

  private updateBallPositionFrame(deltaTime: number) {
    // Calculate new position based on current speed and direction
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);

    const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);

    console.log('ball:', this.ball);
    console.log('pos x:', this.ball.pos.x, ' y:', this.ball.pos.y);
    console.log('new x:', newPos.x, ' y:', newPos.y);
    // handle collisions
    if (newPos.y - this.ball.halfSize <= 0 || newPos.y + this.ball.halfSize >= this.board.height) {
      this.ball.dir.y *= -1;
    } else if(newPos.x - this.ball.halfSize <= 0) {
      this.scorePoint(1);
    } 
    else {
      this.ball.pos.x = newPos.x;
      this.ball.pos.y = newPos.y;
    }
    // this.handleCollisionScoring();

    // Check for collisions, scoring, or other game logic involving the ball
  }

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

  scorePoint(winner: number) {
    if (winner === 2) {
      this.pl2.score += 1;
      this.ball.pos = new Point(this.board.width * 0.5, this.board.height * 0.5);
      this.ball.tRefresh = Date.now();
      this.ball.randomService(this.board, 2);
    } else if (winner === 1) {
      this.pl1.score += 1;
      this.ball.pos = new Point(this.board.width * 0.5, this.board.height * 0.5);
      this.ball.tRefresh = Date.now();
      this.ball.randomService(this.board, 1);
    }
  }

  refreshInMotion() {
    let tmpBall = this.ball.clone(this.board, 'standard');
    let tInterval = Date.now() - this.ball.tRefresh;
    tmpBall.pos.x += tmpBall.speed * tmpBall.dir.x * (tInterval / 1000);
    tmpBall.pos.y += tmpBall.speed * tmpBall.dir.y * (tInterval / 1000);
    let tmpGameParams: GameParams = this.getState();
    tmpGameParams.ball = tmpBall;
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