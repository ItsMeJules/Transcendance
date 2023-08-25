import React, { useEffect, useRef } from 'react';
import { BallNew, GameBoardNew, Player } from '../../../minigame/models'; // Import your GameBoardNew logic

interface PaddleCanvasProps {
  board: GameBoardNew;
  player: Player;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const PaddleCanvas: React.FC<PaddleCanvasProps> = ({ board, player, canvasRef }) => {

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      player.pad.updatePaddle(board.factor);

      if (ctx) {
        ctx.fillStyle = 'white';
        if (player.num === 1)
          ctx.fillRect(0, player.pad.pos, player.pad.width, player.pad.height); // Left paddle
        else if (player.num === 2)
          ctx.fillRect(canvas.width - player.pad.width, player.pad.pos, player.pad.width, player.pad.height); // Right paddle
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, player, board.factor]);

  return null;
};

export default PaddleCanvas;
