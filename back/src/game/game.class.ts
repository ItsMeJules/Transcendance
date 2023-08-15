import { GameBoard } from './models/gameboard.model';
import { Ball } from './models/ball.model';
import { Paddle } from './models/paddle.model';
import { Vector } from './models/vector.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';

// Define GameProperties class and interfaces as needed
export class GameStruct {
  // Define game properties and calculations here
  public tCreate = Date.now();
  public tStart = Date.now();;
  public id: number;
  public status = 'pending';
  public room: string;
  public player1: Player;
  public player2: Player;
  public GameBoard: GameBoard;
  public Ball: Ball;
  public Paddle: Paddle;

  constructor(
    
    id: number,
    player1Id: number,
    player2Id: number,
    room: string) {
    this.id = id;
    this.room = room;
    this.player1 = new Player(player1Id);
    this.player2 = new Player(player2Id);
    this.GameBoard = new GameBoard();
    this.Ball = new Ball();
    this.Paddle = new Paddle();
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
}
