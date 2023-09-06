
const boardWidth = 600;
const boardHeight = 300;

export const initGameConfig = {

  // Board
  board: {
    width: boardWidth,
    height: boardHeight,
    maxWidth: 800,
    minWidth: 350
  },

  // Ball
  ball: {
    size: 10,
    maxSize: 40,
    speed: 500,
    accelFactor: 0.2,
    minWidth: 350,
    maxPaddleBounceAngle: Math.PI * 0.33, // 60 degrees
  },

  // Paddle
  pad: {
    width: 100,
    height: 60,
    wallGap: 10,
    speed: 200,
  },

};