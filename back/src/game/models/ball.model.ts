import { Vector } from './vector.model';
import { Point } from './point.model';

export class Ball {
	// Define ball properties and calculations here
	private Size: number;
	private Speed: number;
	private Pos: Point;
	private AccelarationFactor: number;
	private dir: Vector;
  
	constructor() {
	  this.Size = 20;
	  this.Speed = 2;
	  this.Pos = new Point(300, 150);
	  this.AccelarationFactor = 0.2;
	  this.dir = new Vector(1, 1);
	}

	getDir(): Vector {
	  return this.dir;
	}
	getPos(): Point {
	  return this.Pos;
	}
	getSize(): number {
	  return this.Size;
	}
	getSpeed(): number {
	  return this.Speed;
	}
	getAccelarationFactor(): number {
	  return this.AccelarationFactor;
	}
  }
  