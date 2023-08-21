import { Point } from "../models/point.model";

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
    size: 20,
    speed: 200,
    accelFactor: 0.2,
    minWidth: 350,
    maxPaddleBounceAngle: Math.PI * 0.33, // 60 degrees
  },

  // Paddle
  pad: {
    size: 20,
    speed: 200,
    accelFactor: 0.2,
    minWidth: 350,
    maxPaddleBounceAngle: Math.PI * 0.33, // 60 degrees
  },

};