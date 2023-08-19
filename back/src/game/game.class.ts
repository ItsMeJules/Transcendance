import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Paddle } from './models/paddle.model';
import { Vector } from './models/vector.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { PongEvents } from './pong.gateway';


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

  private readonly updateInterval: number = 1000; // Adjust as needed
  private updateIntervalId: NodeJS.Timeout | null = null;
  private readonly frameRate: number = 60;
  private gameLoopInterval: NodeJS.Timeout | null = null;



  constructor(id: number, pl1Id: number, pl2Id: number, room: string,
    private pongEvents: PongEvents) {
    this.prop = new GameProperties(id, room);
    this.board = new Board();
    this.ball = new Ball(this.board);
    this.pl1 = new Player(pl1Id, this.board);
    this.pl2 = new Player(pl2Id, this.board);
  }

  startGameLoop() {
    if (!this.gameLoopInterval) {
      const frameDuration = 1000 / this.frameRate;
      this.gameLoopInterval = setInterval(() => {

        this.updateBallPosition(frameDuration);

        // You can add more game logic here
        if (Date.now() - this.prop.tStart < 5 * 1000)
          console.log('ballx:', this.ball.pos.x, ' bally:', this.ball.pos.y);

      }, frameDuration);
    }
  }

  private updateBallPosition(deltaTime: number) {
    // Calculate new position based on current speed and direction
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);

    this.ball.pos.x += deltaX;
    this.ball.pos.y += deltaY;

    // Update the ball's tip based on the new position

    // Check for collisions, scoring, or other game logic involving the ball
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
      
    });
    // this.onlineGames.forEach((value, key) => {

    // });
    // if (this.ball && this.prop) {
    //     // Construct the update data as needed
    //     const updateData = {
    //         gameStatus: this.prop.status,
    //         gameState: this.getState(),
    //         time: Date.now(),
    //     };

    //     // Emit the update to the game room
    //     this.server.to().emit('refreshGame', updateDat);
    //     this.server.to(gameStruct.prop.room).emit('gameChannel',
    //       { gameStatus: gameStruct.prop.status, gameState: gameStruct.getState(), time: Date.now() });
    //     }
    // }
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
