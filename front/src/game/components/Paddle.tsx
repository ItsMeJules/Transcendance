import React from 'react';
import { GameProperties } from './GameBoard';

type PaddleProps = {
  top: number;
  gameProperties: GameProperties;
}

const Paddle: React.FC<PaddleProps> = ({ top, gameProperties}) => {
  const { paddleHeight, paddleWidth } = gameProperties;
  return (
    <div
      className="paddle"
      style={{ top: `${top}px`, height: gameProperties.paddleHeight, width: gameProperties.paddleWidth }}
    />
  );
};

export default Paddle;