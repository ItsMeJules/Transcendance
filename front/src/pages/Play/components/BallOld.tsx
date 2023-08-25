export class Point {
  constructor(
    public x: number,
    public y: number) { }
}

export class Vector {
  constructor(
    public x: number,
    public y: number) { }
}

export class BallOld {
  constructor(
    public center: Point,
    public dir: Vector,
    public size: number) {
    this.tip = new Point(center.x - size / 2, center.y - size / 2);
  }
  public tip: Point;

}