export class Board {
  private maxWidth = 800;
  private minWidth = 350;

  public gridWidth = 600;
  public gridHeight = 300;

  public width: number;
  public height: number;
  public factor = 1;
  public scaleFactor = 1;

  constructor(width: number) {
    this.width = this.updateWidth(width);
    this.height = this.width * 0.5;
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
    this.height = this.width * 0.5;
    this.factor = this.width / oldWidth;
    this.scaleFactor = this.width / this.gridWidth;
    return this.factor;
  }
}