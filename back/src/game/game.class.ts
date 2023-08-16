import { GameBoard } from './models/gameboard.model';
import { Ball } from './models/ball.model';
import { Paddle } from './models/paddle.model';
import { Vector } from './models/vector.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';


export interface GameState {
  player1: Player;
  player2: Player;
  ball: Ball;
}

// Define GameProperties class and interfaces as needed
export class GameStruct {
  // Define game properties and calculations here
  public tCreate = Date.now();
  public tStart = Date.now();
  public id: number;
  public status = 'pending';
  public room: string;
  public player1: Player;
  public player2: Player;
  public countdown = -1;
  public gameBoard: GameBoard;
  public ball: Ball;
  public paddle: Paddle;

  constructor(
    id: number,
    player1Id: number,
    player2Id: number,
    room: string) {
    this.id = id;
    this.room = room;
    this.player1 = new Player(player1Id);
    this.player2 = new Player(player2Id);
    this.gameBoard = new GameBoard();
    this.ball = new Ball(this.gameBoard);
  }

  setPlayerReady(id: number) {
    if (id === this.player1.id)
      this.player1.status = 'ready';
    else if (id === this.player2.id)
      this.player2.status = 'ready';
  }

  bothPlayersReady() {
    if (this.player1.status === 'ready'
      && this.player2.status === 'ready')
      return true;
    return false;
  }

  getState(): GameState {
    const state: GameState = {
      player1: this.player1,
      player2: this.player2,
      ball: this.ball,
    };
    return state;
  }  

}
