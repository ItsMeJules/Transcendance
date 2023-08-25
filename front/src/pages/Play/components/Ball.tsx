import React, { useEffect } from 'react';
import { BallNew, GameBoardNew } from 'services/Minigame/models'; // Import your GameBoardNew logic

interface BallCanvasProps {
  board: GameBoardNew;
  ball: BallNew;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BallCanvas: React.FC<BallCanvasProps> = ({ board, ball, canvasRef }) => {

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      ball.updateBall(board.factor);

      if (ctx) {
        // Draw the ball
        ctx.fillStyle = 'white';
        ctx.fillRect(ball.tip.x, ball.tip.y, ball.size, ball.size);
        ctx.setLineDash([]);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, ball, board.factor]);

  return null;
};

export default BallCanvas;
