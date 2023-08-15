export class Vector {
    constructor(public x: number, public y: number) {}

    crossProduct(otherElement: Vector) {
        return this.x * otherElement.y - this.y * otherElement.x;
    }
}