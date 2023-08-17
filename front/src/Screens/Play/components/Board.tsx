import React, { useEffect, useRef } from 'react';
import { GameBoardNew } from '../../../game/models'; // Import your GameBoardNew logic

interface GameBoardProps {
  children: React.ReactNode;
  board: GameBoardNew;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, children }) => {
  // Calculate GameBoard properties
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleResize = () => {
      const newWidth = window.innerWidth * 0.8;
      const factor = board.updateDimensions(newWidth);

      if (ctx && canvas) {
        canvas.width = board.width;
        canvas.height = board.height;
        // Example background fill
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the playing field borders
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Draw the center line
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [board.width, board.height]);

  return (
    <div className="game-board">
      <canvas ref={canvasRef} width={board.width} height={board.height}></canvas>
      {children}
    </div>
  );
};

export default GameBoard;
