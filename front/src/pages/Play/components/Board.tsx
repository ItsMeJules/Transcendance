import React, { useEffect } from 'react';
import { GameBoardNew } from 'services/Minigame/models'; // Import your GameBoardNew logic

interface BoardCanvasProps {
  board: GameBoardNew;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BoardCanvas: React.FC<BoardCanvasProps> = ({ board, canvasRef }) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const handleResize = () => {

      if (ctx && canvas) {
        canvas.width = board.width;
        canvas.height = board.height;

        // Background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Field borders
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Center line
        ctx.setLineDash([3, 10]);
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

  }, [board]);

  return (
    <div className="game-board">
      <canvas ref={canvasRef} width={board.width} height={board.height}></canvas>
    </div>
  );
};

export default BoardCanvas;
