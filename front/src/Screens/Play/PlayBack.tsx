import React, { useEffect, useRef, useState } from "react";
import { Ball } from "./components/Ball";
import { Point, Vector } from "./components/Ball";
import { BallNew, GameBoardNew, Player, PaddleNew } from '../../game/models';

class GameProperties {
    public gameBoard: GameBoardNew;
    public ball: BallNew;
    public paddle: PaddleNew;
    public player1: Player;
    public player2: Player;

    constructor() {
        this.gameBoard = new GameBoardNew(window.innerWidth * 0.8);
        this.ball = new BallNew(this.gameBoard);
        this.paddle = new PaddleNew(this.gameBoard);
        this.player1 = new Player(this.gameBoard);
        this.player2 = new Player(this.gameBoard);
    }

    updateDimensions() {
        this.gameBoard.updateDimensions(window.innerWidth * 0.8);
        this.ball.updateBall(this.gameBoard);
        this.paddle.updatePaddle(this.gameBoard);
    }
}

interface GameBoardProps {
    whichPlayer: string,
}

const PlayBack = () => {
    const gamePropertiesRef = useRef(new GameProperties());
    const [game, setGame] = useState(gamePropertiesRef.current);
    const canvasRef = useRef<HTMLCanvasElement | null>();

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const ball = new Ball(new Point(0, 0), new Vector(1, 1), 32);

        const handleResize = () => {
            const newWidth = window.innerWidth * 0.8; // Adjust as needed
            gamePropertiesRef.current.gameBoard.updateDimensions(newWidth);
            setGameProperties(gamePropertiesRef.current);
            if (ctx) {
                // Draw the background
                canvas.width = gameProperties.gameBoard.width;
                canvas.height = gameProperties.gameBoard.height;

                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the playing field borders
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 4;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                // Draw the center line
                ctx.setLineDash([5, 10]); // Creates a dashed line effect
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, 0);
                ctx.lineTo(canvas.width / 2, canvas.height);
                ctx.stroke();

                // Draw the paddles
                ctx.fillStyle = 'white';
                ctx.fillRect(10, canvas.height / 2 - 30, 10, 60); // Left paddle
                ctx.fillRect(canvas.width - 20, canvas.height / 2 - 30, 10, 60); // Right paddle

                // Draw the ball
                ctx.fillStyle = 'white';
                ctx.fillRect(gameProperties.ball.tip.x, ball.tip.y, ball.size, ball.size);

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
            <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} id="pongCanvas" width="800" height="600"></canvas>
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
    //         gamePropertiesRef.current.gameBoard.updateDimensions(newWidth);
    //         setGameProperties(gamePropertiesRef.current);

    //         const canvas = canvasRef.current;
    //         if (canvas) {
    //             canvas.width = gamePropertiesRef.current.gameBoard.width;
    //             canvas.height = gamePropertiesRef.current.gameBoard.height;
    //         }
    //     };

    //     window.addEventListener('resize', handleResize);
    //     handleResize(); // Initial call to set canvas dimensions

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, [screenSize]);