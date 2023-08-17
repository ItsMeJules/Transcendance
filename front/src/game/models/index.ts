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

  updateWidth(newWidth: number) {
    if (newWidth > this.maxWidth)
      return this.width = this.maxWidth;
    else if (newWidth < this.minWidth)
      return this.width = this.minWidth;
    else
      return this.width = newWidth;
  }

  updateDimensions(newWidth: number) {
    const oldWidth = this.width;
    this.updateWidth(newWidth)
    this.height = this.width * 0.5;
    // console.log('old:', oldWidth, ' new:', newWidth);
    return this.width / oldWidth;
  }
}

export class BallNew {
  // Define ball properties and calculations here
  public size: number;
  public speed: number;
  public pos: Point;
  public tip: Point;
  public accelFactor: number;
  public dir: Vector;

  constructor(gameBoard: GameBoardNew) {
    this.size = gameBoard.width * 20 / 600;
    this.speed = gameBoard.width * 2 / 600;
    this.pos = new Point(gameBoard.width * 0.5, gameBoard.height * 0.5);
    this.tip = new Point(this.pos.x - this.size * 0.5, this.pos.y - this.size * 0.5);
    this.accelFactor = 0.2;
    const randomAngle = Math.random() * (Math.PI / 3) - Math.PI / 6;
    const randomX = Math.random() < 0.5 ? -1 : 1;
    const randomY = Math.random() < 0.5 ? -1 : 1;
    this.dir = new Vector(
      Math.cos(randomAngle) * randomX,
      Math.sin(randomAngle) * randomY);
  }

  updateBall(factor: number) {
    this.pos.x = this.pos.x * factor;
    this.pos.y = this.pos.y * factor;
    this.tip.x = this.tip.x * factor;
    this.tip.y = this.tip.y * factor;
    this.size = this.size * factor;
  }
}

export class Player {
  public status = 'pending';
  public pad: PaddleNew

  constructor(gameBoard: GameBoardNew) {
    this.pad = new PaddleNew(gameBoard);
  }
}

export class PaddleNew {
  public width: number;
  public height: number;
  public speed: number;
  public pos: number;
  // public tip: Point;

  constructor(gameBoard: GameBoardNew) {
    this.width = gameBoard.width * 15 / 600;
    this.height = gameBoard.height * 80 / 300;
    this.speed = gameBoard.height * 10 / 300;
    this.pos = gameBoard.height * 0.5 - this.height * 0.5;
  }

  updatePaddle(factor: number) {
    this.width *= factor;
    this.height *= factor;
    this.speed *= factor;
    this.pos *= factor;
  }

  resetPaddleTop(gameBoard: GameBoardNew) {
    this.pos = gameBoard.height * 0.5;
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
