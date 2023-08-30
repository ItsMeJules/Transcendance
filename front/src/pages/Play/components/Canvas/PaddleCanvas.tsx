import React, { useEffect, useRef } from 'react';
import { Board } from '../../models/Board';
import { Player } from '../../models/Player';
import { GameProperties } from '../../models/Properties';
import { Socket } from 'socket.io-client';

interface PaddleCanvasProps {
  game: GameProperties;
  player: Player;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  whichPlayer: number;
  socket: Socket | null;
}

const PaddleCanvas: React.FC<PaddleCanvasProps> = ({ game, player, canvasRef, whichPlayer, socket }) => {

  useEffect(() => {

    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let movingUp = false;
    let movingDown = false;
    let previousTimestamp = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
          movingUp = true;
          socket?.emit('moveUp', { player: whichPlayer, action: 'pressed' });
        } else if (event.key === 'ArrowDown') {
          movingDown = true;
          socket?.emit('moveDown', { player: whichPlayer, action: 'pressed' });
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (movingUp === true) {
          movingUp = false;
          socket?.emit('unpressUp', { player: whichPlayer, action: 'unpressed' });
        } else if (movingDown === true) {
          movingDown = false;
          socket?.emit('unpressDown', { player: whichPlayer, action: 'unpressed' });
        }
      }
    };

    const animatePaddle = (timestamp: number) => {
      if (!game.isPlaying) return;
      if (!previousTimestamp) {
        previousTimestamp = timestamp;
      }
      const deltaTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;
      if (ctx) {
        ctx.clearRect(0, 0, game.board.width, game.board.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(player.pad.pos.x, player.pad.pos.y, player.pad.width, player.pad.height);
        ctx.setLineDash([]);
      }
      requestAnimationFrame(animatePaddle);
    };

    const handleResize = () => {
      player.pad.refactorPaddle(game.board.factor);

      if (ctx) {
        ctx.fillStyle = 'white';
        if (player.num === 1)
          ctx.fillRect(player.pad.pos.x, player.pad.pos.y, player.pad.width, player.pad.height); // Left paddle
        else if (player.num === 2)
          ctx.fillRect(player.pad.pos.x, player.pad.pos.y, player.pad.width, player.pad.height); // Right paddle
      }
    };

    handleResize();
    requestAnimationFrame(animatePaddle);
    if (whichPlayer !== 0) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (whichPlayer !== 0) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, player, game.board.factor, game.isPlaying]);

  return null;
};

export default PaddleCanvas;
