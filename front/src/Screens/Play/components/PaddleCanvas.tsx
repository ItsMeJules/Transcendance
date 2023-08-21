import React, { useEffect, useRef } from 'react';
import { Board } from '../models/Board';
import { Player } from '../models/Player';
import { GameProperties } from '../models/Properties';

interface PaddleCanvasProps {
  game: GameProperties;
  player: Player;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const PaddleCanvas: React.FC<PaddleCanvasProps> = ({ game, player, canvasRef }) => {

  useEffect(() => {

    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let previousTimestamp = 0;

    const animatePaddle1 = (timestamp: number) => {
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
        ctx.clearRect(0, 0, game.board.width, game.board.height);
  
        
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
  
      requestAnimationFrame(animatePaddle1);
    };



    if (!canvasRef.current) return;

    const handleResize = () => {
      player.pad.refactorPaddle(game.board.factor);

      if (ctx) {
        ctx.fillStyle = 'white';
        if (player.num === 1)
          ctx.fillRect(0, player.pad.pos, player.pad.width, player.pad.height); // Left paddle
        else if (player.num === 2)
          ctx.fillRect(game.board.width - player.pad.width, player.pad.pos, player.pad.width, player.pad.height); // Right paddle
      }
    };

    handleResize();
    requestAnimationFrame(animatePaddle1);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, player, game.board.factor, game.isPlaying]);

  return null;
};

export default PaddleCanvas;
