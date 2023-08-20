import React, { useEffect, useRef } from 'react';
import { Board } from '../models/Board';
import { Ball } from '../models/Ball';
import { GameProperties } from '../models/Properties';

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
      if (!previousTimestamp) {
        previousTimestamp = timestamp;
      }
      const deltaTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;
      // console.log('posx:', ball.pos.x, ' posy:', ball.pos.y);
      // console.log('velx:', ball.dir.x * ball.speed, ' posy:', ball.dir.y * ball.speed);
      if (ctx) {
        // console.log('speed:', ball.speed, ' dirx:', ball.dir.x, ' diry:', ball.dir.y);
        ctx.clearRect(ball.tip.x - 50, ball.tip.y - 50, ball.size + 100, ball.size + 100);

        
        ////////////////////////////////////////////////////////////
        if (whichPlayer === 1) {
          ball.pos.x = ball.pos.x + ball.dir.x * ball.speed * deltaTime;
          ball.pos.y = ball.pos.y + ball.dir.y * ball.speed * deltaTime;
          ball.tip.x = ball.pos.x - ball.size * 0.5;
          ball.tip.y = ball.pos.y - ball.size * 0.5;
        }


        // console.log('posx:', ball.pos.x, ' posy:', ball.pos.y);
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
