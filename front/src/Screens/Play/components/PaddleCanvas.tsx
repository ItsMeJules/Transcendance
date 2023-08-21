import React, { useEffect, useRef } from 'react';
import { Board } from '../models/Board';
import { Player } from '../models/Player';
import { GameProperties } from '../models/Properties';

interface PaddleCanvasProps {
  game: GameProperties;
  player: Player;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  whichPlayer: number;
}

const PaddleCanvas: React.FC<PaddleCanvasProps> = ({ game, player, canvasRef, whichPlayer }) => {

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
      if (ctx) {
        ctx.clearRect(0, 0, game.board.width, game.board.height);
        let posX = player.num === 1 ? 0 : game.board.width - player.pad.width;
        // console.log('posx:', player.pad.pos, ' posy:', ball.pos.y);
        ctx.fillStyle = 'white';
        ctx.fillRect(posX, player.pad.pos, player.pad.width, player.pad.height);
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
