import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Paddle } from './models/paddle.model';
import { Vector } from './models/vector.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';


export interface GameState {
  pl1: Player;
  pl2: Player;
  ball: Ball;
}

// Define GameProperties class and interfaces as needed
export class GameStruct {
  // Define game properties and calculations here
  public prop: GameProperties;
  public board: Board;
  public ball: Ball;
  public pl1: Player;
  public pl2: Player;
  
  public paddle: Paddle;

  constructor(
    id: number,
    pl1Id: number,
    pl2Id: number,
    room: string) {
    this.prop = new GameProperties(id, room);
    this.board = new Board();
    this.ball = new Ball(this.board);
    this.pl1 = new Player(pl1Id, this.board);
    this.pl2 = new Player(pl2Id, this.board);
    
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
