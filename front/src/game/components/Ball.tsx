import React, { useState, useEffect } from 'react';

type BallProps = {
  paddle1Top: number;
  paddle2Top: number;
  resetGame: () => void;
};

const Ball = ({ paddle1Top, paddle2Top, resetGame }: BallProps) => {
  const ballSize = 20;
  const gameBoardWidth = 600;
  const gameBoardHeight = 300;
  const ballSpeed = 2;
  const paddleHeight = 80;
  const paddleWidth = 20;

  const [speed, setSpeed] = useState({ x: ballSpeed, y: ballSpeed});
  const [position, setPosition] = useState({ x: gameBoardWidth / 2, y: gameBoardHeight / 2 });

  const calculateAngle = (hitPoint: number, paddleTop: number, paddleHeight: number) => {
	// Normalize the hit point to a value between -1 and 1
	const normalizedHitPoint = 2 * (hitPoint - paddleTop) / paddleHeight - 1;
  
	// Use a quadratic function to calculate the angle
	const angle = normalizedHitPoint * normalizedHitPoint * Math.PI / 4;
  
	return angle;
  };

/* or 

const calculateAngle = (ballY: number, paddleY: number, paddleHeight: number) => {
  // Divisez la raquette en 5 segments et calculez le segment qui a été touché
  const hitPoint = (ballY - (paddleY - paddleHeight / 2)) / paddleHeight;
  const segments = [-3/2, -1/2, 0, 1/2, 3/2];
  const hitSegment = segments.find((seg, i) => hitPoint < seg) || segments[segments.length - 1];

  // Retourne un nouvel angle basé sur le segment touché
  return hitSegment * (Math.PI / 12); // L'angle est entre -45 et 45 degrés
};

*/


  const calculateSpeed = (angle: number, speed: number) => {
	// Calculate the new speed in the x and y directions
	const xSpeed = Math.cos(angle) * speed;
	const ySpeed = Math.sin(angle) * speed;
  
	return { x: xSpeed, y: ySpeed };
  };

  const resetBall = () => {
    setPosition({ x: gameBoardWidth / 2, y: gameBoardHeight / 2 });
    setSpeed({ x: ballSpeed, y: -ballSpeed });
  };

  useEffect(() => {
    const updatePosition = () => {
      let newPosX = position.x + speed.x * ballSpeed;
      let newPosY = position.y + speed.y * ballSpeed;

      // Check for collisions with the horizontal game board boundaries
      if (newPosY - ballSize / 2 <= 0 || newPosY + ballSize / 2 >= gameBoardHeight) {
        setSpeed(prevSpeed => ({ ...prevSpeed, y: -prevSpeed.y }));
      } else {
        setPosition(prevPosition => ({ ...prevPosition, y: newPosY }));
      }

      // Check if the ball hits the vertical game board boundaries to end the match
      if (newPosX - ballSize / 2 <= 0 || newPosX + ballSize / 2 >= gameBoardWidth) {
        resetBall();
        resetGame();
      } else if ((speed.x < 0 && newPosX - ballSize / 2 <= paddleWidth && newPosY + ballSize / 2 >= paddle1Top && newPosY - ballSize / 2 <= paddle1Top + paddleHeight) ||
          (speed.x > 0 && newPosX + ballSize / 2 >= gameBoardWidth - paddleWidth && newPosY + ballSize / 2 >= paddle2Top && newPosY - ballSize / 2 <= paddle2Top + paddleHeight)) {
        // Calculate the angle of the ball based on the hit point on the paddle
        const paddleY = speed.x < 0 ? paddle1Top : paddle2Top;
        const angle = calculateAngle(newPosY, paddleY, paddleHeight);

        // Calculate new speed components based on the hit angle
        const newSpeed = calculateSpeed(angle, ballSpeed);

        // Adjust speed direction based on the paddle hit
        setSpeed({ x: speed.x < 0 ? Math.abs(newSpeed.x) : -Math.abs(newSpeed.x), y: newSpeed.y });
      } else {
        // Update the ball's x position only if it doesn't cross the boundaries
        setPosition(prevPosition => ({ ...prevPosition, x: newPosX }));
      }
    };

    const animateBall = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animateBall);
    };
  }, [position, speed, paddle1Top, paddle2Top, resetGame]);

  return (
    <div
      className="ball"
      style={{ top: `${position.y}px`, left: `${position.x}px`, width: ballSize, height: ballSize }}
    />
  );
};

export default Ball;