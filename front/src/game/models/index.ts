export interface GameState {
  player1: Player;
  player2: Player;
  ball: BallNew;
}

export class GameBoardNew {
  // Change here if needed
  private maxWidth = 800;
  private minWidth = 350;
  public width: number;
  public height: number;

  constructor(width: number) {
    this.width = this.updateWidth(width);
    this.height = this.width * 0.5;
  }

  updateWidth(width: number) {
    if (width > this.maxWidth)
      return this.width = this.maxWidth;
    else if (width < this.minWidth)
      return this.width = this.minWidth;
    else
      return this.width = width;
  }

  updateDimensions(width: number) {
    if (width > this.maxWidth)
      this.width = this.maxWidth;
    else if (width < this.minWidth)
      this.width = this.minWidth;
    else
      this.width = width;
    this.height = this.width * 0.5;
  }

}

export class BallNew {
  // Define ball properties and calculations here
  public size: number;
  public speed: number;
  public pos: Point;
  public accelFactor: number;
  public dir: Vector;

  constructor(gameBoard: GameBoardNew) {
    this.size = gameBoard.width * 20 / 600;
    this.speed = gameBoard.width * 2 / 600;
    this.pos = new Point(gameBoard.width * 0.5, gameBoard.height * 0.5);
    this.accelFactor = 0.2;
    const randomAngle = Math.random() * (Math.PI / 3) - Math.PI / 6;
    const randomX = Math.random() < 0.5 ? -1 : 1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * randomX,
      Math.sin(randomAngle) * randomY);
  }

  updateBall(gameBoard: GameBoardNew) {
    this.size = gameBoard.width * 20 / 600;
    this.speed = gameBoard.width * 2 / 600;
  }
}

export class Player {
  // public id: number;
  public status = 'pending';
  public posPaddleTop: number;

  constructor(gameBoard: GameBoardNew) {
    this.posPaddleTop = gameBoard.height * 110 / 300;
  }

  updatePaddleTop(oldGameBoardHeight: number, newGameBoardHeight: number) {
    this.posPaddleTop = (this.posPaddleTop / oldGameBoardHeight) * newGameBoardHeight;
  }

  resetPaddleTop(gameBoard: GameBoardNew) {
    this.posPaddleTop = gameBoard.height * 110 / 300;
  }
}

export class PaddleNew {
  // Define paddle properties and calculations here
  public width: number;
  public height: number;
  public speed: number;

  constructor(gameBoard: GameBoardNew) {
    this.width = gameBoard.width * 20 / 600;
    this.height = gameBoard.height * 80 / 300;
    this.speed = gameBoard.height * 10 / 300;
  }

  updatePaddle(gameBoard: GameBoardNew) {
    this.width = gameBoard.height * 20 / 600;
    this.height = gameBoard.width * 20 / 600;
    this.speed = gameBoard.height * 10 / 300;
  }
}

export class Vector {
  // Define vector properties and calculations here
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Point {
  // Define point properties and calculations here
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
