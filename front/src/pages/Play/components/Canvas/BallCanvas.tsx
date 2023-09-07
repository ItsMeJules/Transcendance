import React, { useEffect, useRef } from 'react';
import { GameProperties } from '../../models/Properties';

interface BallCanvasProps {
  game: GameProperties;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BallCanvas: React.FC<BallCanvasProps> = ({ game, canvasRef }) => {
  const continueAnimation = useRef(true);

  useEffect(() => {
    let ball = game.ball;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx && game.isEnded) {
      continueAnimation.current = false;
      ctx.clearRect(0, 0, game.board.width, game.board.height);
      return;
    }

    const animateBall = (timestamp: number) => {
      if (!game.isPlaying && !game.isEnded) return;
      if (ctx) {
        ctx.clearRect(0, 0, game.board.width, game.board.height);
        if (game.isEnded) return;
        ctx.fillStyle = 'white';
        ctx.fillRect(ball.tip.x, ball.tip.y, ball.size, ball.size);
        ctx.setLineDash([]);
      }
      if (continueAnimation.current)
        requestAnimationFrame(animateBall);
    };

    const handleResize = () => {
      ball.refactorBall(game.board.factor);
      if (ctx) {
        ctx.clearRect(0, 0, game.board.width, game.board.height);
        if (game.isEnded) return;
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
  }, [canvasRef, game.ball, game.board.factor, game.isPlaying, game.isEnded]);

  return null;
};

export default BallCanvas;
