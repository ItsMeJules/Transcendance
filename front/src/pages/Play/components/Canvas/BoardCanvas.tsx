import React, { useEffect } from 'react';
import { GameProperties } from '../../models/Properties';

interface BoardCanvasProps {
  game: GameProperties;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BoardCanvas: React.FC<BoardCanvasProps> = ({ game, canvasRef }) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let resizeTimeout: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        if (ctx && canvas) {
          canvas.width = game.board.width;
          canvas.height = game.board.height;
          // Background
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Field borders
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          // Center line
          ctx.imageSmoothingEnabled = false;
          ctx.setLineDash([5, 10]);
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, 0);
          ctx.lineTo(canvas.width / 2, canvas.height);
          ctx.stroke();

        }
      }, 10);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [game.board, game.ball, canvasRef]);

    return null;
};

export default BoardCanvas;
