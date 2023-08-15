export class GameBoard {
	width: number;
	height: number;
  
	constructor() {
	  this.width = 600;
	  this.height = 300;
	}
  
	getWidth(): number {
	  return this.width;
	}
  
	getHeight(): number {
	  return this.height;
	}
  }