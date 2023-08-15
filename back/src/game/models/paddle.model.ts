export class Paddle {
	// Define paddle properties and calculations here
	private Width: number;
	private Height: number;
	private Speed: number;
  
	constructor() {
	  this.Width = 20;
	  this.Height = 80;
	  this.Speed = 10;
	}
	
	getWidth(): number {
	  return this.Width;
	}
	getHeight(): number {
	  return this.Height;
	}
	getSpeed(): number {
	  return this.Speed;
	}
  }