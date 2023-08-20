import { Board, CollisionPointsBall, CollisionPointsSides } from './models/board.model';
import { Ball } from './models/ball.model';
import { Paddle } from './models/paddle.model';
import { Vector } from './models/vector.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { PongEvents } from './pong.gateway';
import { copyFileSync } from 'fs';

export interface GameState {
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
  public collisionType = '';
  public prints = 12 * 4;

  private readonly updateInterval: number = 100; // Adjust as needed
  private updateIntervalId: NodeJS.Timeout | null = null;
  private readonly frameRate: number = 60;
  private frameDuration: number;
  private gameLoopInterval: NodeJS.Timeout | null = null;

  constructor(id: number, pl1Id: number, pl2Id: number, room: string,
    private pongEvents: PongEvents) {
    this.prop = new GameProperties(id, room);
    this.board = new Board();
    this.ball = new Ball(this.board);
    this.pl1 = new Player(pl1Id, this.board);
    this.pl2 = new Player(pl2Id, this.board);
    this.board.updatePointsAndCollisionParameters(this.pl1.pad);
    this.frameDuration = 1000 / this.frameRate;
  }

  startGameLoop() {
    let distanceToPass = 0;
    this.ball.tRefresh = Date.now();
    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {
        this.updateGame(distanceToPass);
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
    //   console.log('ball before:', this.ball);
    //   console.log(' ');
    //   this.prints -= 1;
    // }

    this.updateBallPosition(distanceToPass);
    this.handleCollision();
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

  private handleCollision() {
    if (this.collisionType === 'low') {
      this.ball.dir.y = -this.ball.dir.y;
    } else if (this.collisionType === 'up') {
      this.ball.dir.y = -this.ball.dir.y;
    } else if (this.collisionType === 'left') {
      // scorePoint();
      this.ball.dir.x = -this.ball.dir.x;
    } else if (this.collisionType === 'right') {
      this.ball.dir.x = -this.ball.dir.x;
    }
    // this.collisionType = '';
  }

  refreshInMotion() {
    let tmpBall = this.ball.clone(this.board);
    let tInterval = Date.now() - this.ball.tRefresh;
    tmpBall.pos.x += tmpBall.speed * tmpBall.dir.x * (tInterval / 1000);
    tmpBall.pos.y += tmpBall.speed * tmpBall.dir.y * (tInterval / 1000);
    let tmpGameState: GameState = this.getState();
    tmpGameState.ball = tmpBall;
    this.pongEvents.server.to(this.prop.room).emit('refreshGame',
      { gameStatus: this.prop.status, gameState: tmpGameState, time: Date.now() });
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
          { gameStatus: value.prop.status, gameState: value.getState(), time: Date.now() });
    });
  }

  private sendUpdate() {
    if (this.prop.status === 'playing')
      this.pongEvents.server.to(this.prop.room).emit('refreshGame',
        { gameStatus: this.prop.status, gameState: this.getState(), time: Date.now() });
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

  getState(): GameState {
    const state: GameState = {
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