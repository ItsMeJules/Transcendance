import React, { useEffect } from "react";
import { Ball } from "./components/Ball";
import { Point, Vector } from "./components/Ball";

const PlayBack = () => {

    useEffect(() => {
        const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const ball = new Ball(new Point(0,0), new Vector(1,1), 32);

        if (ctx) {
            // Draw the background
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
            ctx.fillRect(ball.tip.x, ball.tip.y, ball.size, ball.size);

            // Reset dashed line effect
            ctx.setLineDash([]);
        }

    }, []);


    return (
        <div className="pong-game" style={{ alignContent: 'center'}}>
            <canvas id="pongCanvas" width="800" height="600"></canvas>
        </div>
    );

};

export default PlayBack;