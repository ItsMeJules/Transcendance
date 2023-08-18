import React, { useEffect, useRef } from 'react';
import { Board } from '../models/Board';
import { Ball } from '../models/Ball';
import { GameProperties } from '../models/Properties';

interface BallCanvasProps {
  game: GameProperties;
  ball: Ball;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BallCanvas: React.FC<BallCanvasProps> = ({ game, ball, canvasRef }) => {

  useEffect(() => {
    
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let previousTimestamp = 0;

    const animateBall = (timestamp: number) => {
      if (!game.isStarted) return;
      if (!previousTimestamp) {
        previousTimestamp = timestamp;
      }
      const deltaTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;
      // console.log('posx:', ball.pos.x, ' posy:', ball.pos.y);
      // console.log('velx:', ball.dir.x * ball.speed, ' posy:', ball.dir.y * ball.speed);
      if (ctx) {
        console.log('speed:', ball.speed, ' dirx:', ball.dir.x, ' diry:', ball.dir.y);
        ctx.clearRect(ball.tip.x - 1, ball.tip.y - 1, ball.size + 2, ball.size + 2);
        ball.pos.x = ball.pos.x + ball.dir.x * ball.speed * deltaTime * 50;
        ball.pos.y = ball.pos.y + ball.dir.y * ball.speed * deltaTime * 50;
        ball.tip.x = ball.pos.x - ball.size * 0.5;
        ball.tip.y = ball.pos.y - ball.size * 0.5;
        ctx.fillStyle = 'white';
        ctx.fillRect(ball.tip.x, ball.tip.y, ball.size, ball.size);
        ctx.setLineDash([]);
      }

      requestAnimationFrame(animateBall);
    };

    const handleResize = () => {
      ball.refactorBall(game.board.factor);

      if (ctx) {
        // Draw the ball
        console.log('tipx:', ball.tip.x, ' tipy:', ball.tip.y);
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
  }, [canvasRef, ball, game.board.factor, game.isStarted]);

  return null;
};

export default BallCanvas;
