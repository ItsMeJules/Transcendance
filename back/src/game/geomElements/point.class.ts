import { Vector } from "./vector.class"

export class Point {
  constructor(public x: number, public y: number) { }

  vectorTo(otherElement: Point) {
    return new Vector(otherElement.x - this.x, otherElement.y - this.y);
  }

  midSegment(otherElement: Point) {
    return new Point(
      (this.x + otherElement.x) / 2,
      (this.y + otherElement.y) / 2);
  }

  intersection(to1: Point, from2: Point, to2: Point) {
    if ((this.x === to1.x && this.y === to1.y) ||
      (from2.x === to2.x && from2.y === to2.y))
      return 0;
    let from1 = new Point(this.x, this.y);
    let v1 = from1.vectorTo(to1);
    let v2 = from2.vectorTo(to2);
    let centerToCenter = from1.vectorTo(from2);
    let crossProduct1 = centerToCenter.crossProduct(v2);
    let crossProduct2 = v1.crossProduct(v2);
    if (crossProduct2 === 0)
      return 0;
    return crossProduct1 / crossProduct2;
  }
}