import { GameBoard } from './models/gameboard.model';
import { Ball } from './models/ball.model';
import { Paddle } from './models/paddle.model';
import { Vector } from './models/vector.model';
import { Point } from './models/point.model';

// Define GameProperties class and interfaces as needed
class GameProperties {
	// Define game properties and calculations here
	private GameBoard: GameBoard;
	private Ball: Ball;
	private Paddle: Paddle;
	
	constructor() {
	  this.GameBoard = new GameBoard();
	  this.Ball = new Ball();
	  this.Paddle = new Paddle();
	}
  }