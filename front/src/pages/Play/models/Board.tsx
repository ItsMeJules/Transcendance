import { initGameConfig } from "../init/game.properties";

export class Board {
  private maxWidth = initGameConfig.board.maxWidth;
  private minWidth = initGameConfig.board.minWidth;

  public gridWidth = initGameConfig.board.width;
  public gridHeight = initGameConfig.board.height;

  public hWFactor = this.gridHeight / this.gridWidth;
  public width: number;
  public height: number;
  public factor = 1;
  public scaleFactor = 1;

  constructor(width: number) {
    this.width = this.updateWidth(width);
    this.height = this.width * this.hWFactor;
    this.scaleFactor = this.width / this.gridWidth;
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
    this.height = this.width * this.hWFactor;
    this.factor = this.width / oldWidth;
    this.scaleFactor = this.width / this.gridWidth;
    return this.factor;
  }
}