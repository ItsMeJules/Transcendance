import React from 'react';

interface PaddleProps {
  top: number;
}

const Paddle: React.FC<PaddleProps> = ({ top }) => {
  return (
    <div
      className="paddle"
      style={{ top: `${top}px` }}
    />
  );
};

export default Paddle;