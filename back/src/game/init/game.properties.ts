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
    size: 10,
    maxSize: 40,
    speed: 200,
    maxSpeed: 500,
    accelFactor: 10,
    minWidth: 350,
    maxPaddleBounceAngle: Math.PI * 0.33, // 60 degrees
  },

  // Paddle
  pad: {
    width: 15,
    maxWidth: boardWidth * 0.25, // To match with ball maxsize!! 
    height: 60,
    maxHeight: boardHeight * 0.5 - 60,
    wallGap: 10,
    speed: 200,
    maxSpeed: 400,
  },

};