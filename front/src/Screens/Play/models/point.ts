import { Board } from "./Board";

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  updatePoint(board: Board, newPoint: Point) {
    this.x = newPoint.x * board.width / board.gridWidth;
    this.y = newPoint.y * board.height / board.gridHeight ;
  }
}
