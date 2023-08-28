import React, { useEffect, useRef } from 'react';
import { Board } from '../../models/Board';
import { Ball } from '../../models/Ball';
import { GameProperties } from '../../models/Properties';

interface BallCanvasProps {
  game: GameProperties;
  ball: Ball;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  whichPlayer: number;
}

const BallCanvas: React.FC<BallCanvasProps> = ({ game, ball, canvasRef, whichPlayer }) => {
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let previousTimestamp = 0;
    const animateBall = (timestamp: number) => {
      if (!game.isPlaying) return;
      const deltaTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;
      if (ctx) {
        ctx.clearRect(0, 0, game.board.width, game.board.height);
        // ball.pos.x = ball.pos.x + ball.dir.x * ball.speed * deltaTime * game.board.width / game.board.gridWidth;
        // ball.pos.y = ball.pos.y + ball.dir.y * ball.speed * deltaTime * game.board.width / game.board.gridWidth;
        // ball.tip.x = ball.pos.x - ball.size * 0.5;
        // ball.tip.y = ball.pos.y - ball.size * 0.5;
        ctx.fillStyle = 'white';
        ctx.fillRect(ball.tip.x, ball.tip.y, ball.size, ball.size);
        ctx.setLineDash([]);
      }
      requestAnimationFrame(animateBall);
    };

    const handleResize = () => {
      // console.log('pos before:', ball.pos);
      ball.refactorBall(game.board.factor);
      // console.log('pos after:', ball.pos);
      if (ctx) {
        // Draw the ball

        ctx.fillStyle = 'white';
        ctx.fillRect(ball.tip.x, ball.tip.y, ball.size, ball.size);
        ctx.setLineDash([]);
      }
    };

    handleResize();
    requestAnimationFrame(animateBall);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, ball, game.board.factor, game.isPlaying]);

  return null;
};

export default BallCanvas;
