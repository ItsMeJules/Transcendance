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

  public paddle: Paddle;

  public prevFrameTime = 0;
  public first = true;
  public collisionType = '';
  public prints = 4 * 4;

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
    this.frameDuration = 1000 / this.frameRate;
  }

  startGameLoop() {
    let frame = 0;
    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {
        this.updateGame(frame);
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
    const determinant = ballColPts.a * sideColPts.b - sideColPts.a * ballColPts.b;

    if (determinant === 0) {
      return new Point(100000, 100000);
      //do something about it
    } else {
      var x = (sideColPts.b * ballColPts.c - ballColPts.b * sideColPts.c) / determinant;
      var y = (ballColPts.a * sideColPts.c - sideColPts.a * ballColPts.c) / determinant;
    }

    if (this.prints > 0) {
      console.log('side:', side);
      console.log('ball:', ballColPts);
      console.log('walls:', sideColPts);
      console.log('x:', x, ' y:', y);
      console.log(' ');
      this.prints -= 1;
    }

    return (new Point(x, y));
  }

  getMinDistCollision() {
    let lowPt = this.computeCollision('low');
    let upPt = this.computeCollision('up');

    let distLow = lowPt.distanceToPointBallSide(this.ball, 'low');
    let distUp = upPt.distanceToPointBallSide(this.ball, 'up');
    if (Math.round(distLow) === 0) distLow = 10000;
    if (Math.round(distUp) === 0) distUp = 10000;

    if (this.prints > 0) {
      console.log('dlow:', distLow, ' dup:', distUp);
      console.log(' ');
      this.prints -= 1;
    }

    if (Math.min(distLow, distUp) === distLow) {
      this.collisionType = 'low';
      return distLow;
    } else if (Math.min(distLow, distUp) === distUp) {
      this.collisionType = 'up';
      return distUp;
    }
    return null;
  }

  private updateGame(frame) {

    if (this.prints > 0) {
      console.log('ball before:', this.ball);
      console.log(' ');
      this.prints -= 1;
    }

    this.updateBallPosition(frame);
    this.handleCollision();
    this.sendUpdate();

    if (this.prints > 0) {
      console.log('ball mid:', this.ball);
      console.log(' ');
      this.prints -= 1;
    }

    const distanceToPoint = this.getMinDistCollision();
    const timeToCollision = distanceToPoint / this.ball.speed * 1000;
    frame = timeToCollision;

    if (this.prints > 0) {
      console.log('ball after:', this.ball);
      console.log('distance:', distanceToPoint);
      console.log(' ');
      this.prints -= 1;
    }
    



    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.updateGame(frame);
    }, timeToCollision);
  }

  private updateBallPosition(deltaTime: number) {
    // Calculate new position based on current speed and direction
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);

    // const checkCollision()
    this.ball.pos.x += deltaX;
    this.ball.pos.y += deltaY;
    // Update the ball's tip based on the new position
    // Check for collisions, scoring, or other game logic involving the ball
  }



  private handleCollision() {
    if (this.collisionType === 'low') {
      this.ball.dir.y = -this.ball.dir.y;
    } else if (this.collisionType === 'up') {
      this.ball.dir.y = -this.ball.dir.y;
    }
    this.collisionType = '';
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
//   const frameStartTime = Date.now();
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