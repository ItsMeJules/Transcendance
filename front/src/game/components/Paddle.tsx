import React from 'react';
import { GameProperties } from './GameBoard';

type PaddleProps = {
  top: number;
  gameProperties: GameProperties;
}

// const Paddle: React.FC<PaddleProps> = ({ top, gameProperties}) => {
  // const { paddle } = gameProperties;
  // return (
  //   <div
  //     className="paddle"
  //     style={{ top: `${top}px`, height: gameProperties.paddle.height, width: gameProperties.paddle.width }}
  //   />
  // );
// };

// export default Paddle;