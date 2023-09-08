import React, { useEffect, useRef } from 'react';
import { GameProperties } from '../../models/Properties';
import { Socket } from 'socket.io-client';
import { Player } from 'pages/Play/models/Player';
import { Ball } from 'pages/Play/models/Ball';

interface CombinedCanvasProps {
  game: GameProperties;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  whichPlayer: number;
  socket: Socket | null;
}

const CombinedCanvas: React.FC<CombinedCanvasProps> = ({ game, canvasRef, whichPlayer, socket }) => {
  const continueAnimation = useRef(true);

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    // Draw board background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game.board.width, game.board.height);

    // Draw solid outer rectangle
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.setLineDash([]); // Reset the line dash setting to have solid lines
    ctx.strokeRect(0, 0, game.board.width, game.board.height);

    // Draw dashed center line
    ctx.imageSmoothingEnabled = false;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    ctx.moveTo(game.board.width / 2, 0);
    ctx.lineTo(game.board.width / 2, game.board.height);
    ctx.stroke();
  }

  const drawBall = (ctx: CanvasRenderingContext2D, deltaTime:number) => {
    // Backend ball
    ctx.fillStyle = 'white';
    ctx.fillRect(game.ball.tip.x, game.ball.tip.y, game.ball.size, game.ball.size);
  }

  const drawPaddle = (ctx: CanvasRenderingContext2D, player: Player) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.pad.pos.x, player.pad.pos.y, player.pad.width, player.pad.height);
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (event.key === 'ArrowUp') {
        socket?.emit('moveUp', { player: whichPlayer, action: 'pressed' });
      } else if (event.key === 'ArrowDown') {
        socket?.emit('moveDown', { player: whichPlayer, action: 'pressed' });
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (event.key === 'ArrowUp') {
        socket?.emit('unpressUp', { player: whichPlayer, action: 'unpressed' });
      } else if (event.key === 'ArrowDown') {
        socket?.emit('unpressDown', { player: whichPlayer, action: 'unpressed' });
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let previousTimestamp = 0;

    // Combined Resize Handler
    const handleResize = () => {
      if (ctx && canvas) {
        canvas.width = game.board.width;
        canvas.height = game.board.height;
        drawBoard(ctx);
        drawBall(ctx, 0);
        drawPaddle(ctx, game.pl1);
        drawPaddle(ctx, game.pl2);
      }
    };

    const animate = (timestamp: number) => {
      if (game.isEnded && ctx) {
        continueAnimation.current = false;
        ctx.clearRect(-game.board.width, -game.board.height, game.board.width * 2, game.board.height * 2);
        return;
      }

      const deltaTime = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;

      if (ctx) {
        ctx.clearRect(0, 0, game.board.width, game.board.height);

        drawBoard(ctx);
        if (game.isEnded) return;

        drawBall(ctx, deltaTime);
        drawPaddle(ctx, game.pl1);
        drawPaddle(ctx, game.pl2);
      }

      if (continueAnimation.current) requestAnimationFrame(animate);
    };


    handleResize();
    requestAnimationFrame(animate);

    window.addEventListener('resize', handleResize);

    if (whichPlayer !== 0) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (whichPlayer !== 0) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
    };

  }, [canvasRef, game.ball, game.board, game.isPlaying, game.isEnded, game.pl1, game.pl2]);

  return null;
};

export default CombinedCanvas;
