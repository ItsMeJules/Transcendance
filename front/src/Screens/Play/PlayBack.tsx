import React, { useEffect, useRef, useState } from "react";
import { Ball } from "./components/BallOld";
import { Point, Vector } from "./components/BallOld";
import { BallNew, GameBoardNew, Player, PaddleNew } from '../../game/models';
import GameBoard from "./components/Board";

class GameProperties {
  public board: GameBoardNew;
  public ball: BallNew;
  public pl1: Player;
  public pl2: Player;

  constructor() {
    this.board = new GameBoardNew(window.innerWidth * 0.8);
    this.ball = new BallNew(this.board);
    this.pl1 = new Player(this.board);
    this.pl2 = new Player(this.board);
  }

  // updateDimensions() {
  //   this.board.updateDimensions(window.innerWidth * 0.8);
  //   // this.ball.updateBall(this.board);
  //   this.paddle.updatePaddle(this.board);
  // }
}

interface GameBoardProps {
  whichPlayer: string,
}

const PlayBack = () => {
  const gameRef = useRef(new GameProperties());
  const [game, setGame] = useState(gameRef.current);
  const canvasRef = useRef<HTMLCanvasElement | null>();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const newWidth = window.innerWidth * 0.8;
      const factor = gameRef.current.board.updateDimensions(newWidth);
      gameRef.current.ball.updateBall(factor);
      gameRef.current.pl1.pad.updatePaddle(factor);
      gameRef.current.pl2.pad.updatePaddle(factor);

      setGame({ ...game });
      
      if (ctx) {
        // Draw the background
        canvas.width = game.board.width;
        canvas.height = game.board.height;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the playing field borders
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Draw the center line
        ctx.setLineDash([5, 10]); 
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        // Draw the paddles
        ctx.fillStyle = 'white';
        ctx.fillRect(0, game.pl1.pad.pos, game.pl1.pad.width, game.pl1.pad.height); // Left paddle
        ctx.fillRect(canvas.width - game.pl2.pad.width, game.pl2.pad.pos, game.pl2.pad.width, game.pl2.pad.height); // Right paddle

        // Draw the ball
        ctx.fillStyle = 'white';
        ctx.fillRect(game.ball.tip.x, game.ball.tip.y, game.ball.size, game.ball.size);

        // Reset dashed line effect
        ctx.setLineDash([]);
      }
    }
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <div className="pong-game" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '250px' }}>
      {/* <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} id="pongCanvas" width="800" height="600"></canvas> */}
      <GameBoard board={game.board}>
      </GameBoard>
    </div>
  );

};

export default PlayBack;






// const getCurrentDimension = () => {
    //     return {
    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     }
    // }

    // const [screenSize, setScreenSize] = useState(getCurrentDimension());

    // useEffect(() => {
    //     const updateDimension = () => {
    //         setScreenSize(getCurrentDimension())
    //     }
    //     window.addEventListener('resize', updateDimension);

    //     return (() => {
    //         window.removeEventListener('resize', updateDimension);
    //     })
    // }, [screenSize])

    // useEffect(() => {
    //     const handleResize = () => {
    //         const newWidth = screenSize.width * 0.8;
    //         gameRef.current.board.updateDimensions(newWidth);
    //         setgame(gameRef.current);

    //         const canvas = canvasRef.current;
    //         if (canvas) {
    //             canvas.width = gameRef.current.board.width;
    //             canvas.height = gameRef.current.board.height;
    //         }
    //     };

    //     window.addEventListener('resize', handleResize);
    //     handleResize(); // Initial call to set canvas dimensions

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, [screenSize]);