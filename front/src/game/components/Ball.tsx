import React, { useRef, useState, useEffect } from 'react';
import { GameProperties } from './GameBoard';

type BallProps = {
  gameProperties: GameProperties;
  paddle1Top: number;
  paddle2Top: number;
  resetGame: () => void;
  updateScores: (player1: number, player2: number) => void; // Ajoutez cette ligne
  lastScorer: boolean;
};

const Ball = ({ gameProperties, paddle1Top, paddle2Top, resetGame, updateScores , lastScorer}: BallProps) => {
  const { gameBoard, ball, paddle} = gameProperties;
  let accelerationFactor = gameProperties.ball.accelFactor;

  const [speed, setSpeed] = useState({ x: ball.speed, y: ball.speed });
  const [position, setPosition] = useState({ x: ball.pos.x, y: ball.pos.y });
  const MIN_REFLECTION_ANGLE = Math.PI / 3;

  const calculateAngle = (hitPoint: number, paddleTop: number, paddleHeight: number) => {
    // Normalize the hit point to a value between -1 and 1
    const normalizedHitPoint = 2 * (hitPoint - paddleTop) / paddleHeight - 1;

    // Use a quadratic function to calculate the angle
    let angle = normalizedHitPoint * normalizedHitPoint * Math.PI / 4;

    if (Math.abs(angle) < MIN_REFLECTION_ANGLE) {
      angle = angle < 0 ? -MIN_REFLECTION_ANGLE : MIN_REFLECTION_ANGLE;
    }

    return angle;
  };

  const calculateSpeed = (angle: number, speed: number) => {
    // Calculate the new speed in the x and y directions
    const xSpeed = Math.cos(angle) * speed;
    const ySpeed = Math.sin(angle) * speed;

    return { x: xSpeed, y: ySpeed };
  };

  const resetBall = () => {
    accelerationFactor = 1;
    const randomY = Math.random() * gameBoard.height;
    const isUpperHalf = randomY < gameBoard.height / 2;

    setPosition({ x: gameBoard.width / 2, y: randomY });

    const xDirection = lastScorer ? -ball.speed : ball.speed;
    const yDirection = isUpperHalf ? ball.speed : -ball.speed;

    setSpeed({ x: xDirection, y: yDirection });
  };

  useEffect(() => {
    const updatePosition = () => {
      let newPosX = position.x + speed.x * ball.speed;
      let newPosY = position.y + speed.y * ball.speed;

      // Check for collisions with the horizontal game board boundaries
      if (newPosY - ball.size / 2 <= 0 || newPosY + ball.size / 2 >= gameBoard.height) {
        setSpeed(prevSpeed => ({ ...prevSpeed, y: -prevSpeed.y }));
      } else {
        setPosition(prevPosition => ({ ...prevPosition, y: newPosY }));
      }

      // Check if the ball hits the vertical game board boundaries to end the match
      if (newPosX - ball.size / 2 <= 0) {
        updateScores(0, 1);
        resetBall();
      } else if (newPosX + ball.size / 2 >= gameBoard.width) {
        updateScores(1, 0);
        resetBall();
      } else if ((speed.x < 0 && newPosX - ball.size / 2 <= paddle.width && newPosY + ball.size / 2 >= paddle1Top && newPosY - ball.size / 2 <= paddle1Top + paddle.height) ||
        (speed.x > 0 && newPosX + ball.size / 2 >= gameBoard.width - paddle.width && newPosY + ball.size / 2 >= paddle2Top && newPosY - ball.size / 2 <= paddle2Top + paddle.height)) {
        // Get the new angle and speed based on the paddle hit
        const incidentAngle = Math.atan2(speed.y, speed.x);
        // Calculate the hit point on the paddle
        const paddleY = speed.x < 0 ? paddle1Top : paddle2Top;
        // Calculate the reflection modifier based on the hit point
        const reflectionModifier = calculateAngle(newPosY, paddleY, paddle.height);
        // Calculate the reflection angle by adding the incident angle and the reflection modifier
        const reflectionAngle = incidentAngle + reflectionModifier;
        const currentSpeedMagnitude = Math.sqrt(speed.x * speed.x + speed.y * speed.y);
        // Calculate the new speed components using the reflection angle
        const newSpeed = calculateSpeed(reflectionAngle, currentSpeedMagnitude);
        // Reverse the x direction based on the paddle hit
        accelerationFactor += 0.2;
        setSpeed({
          x: (speed.x < 0 ? Math.abs(newSpeed.x) : -Math.abs(newSpeed.x)) * accelerationFactor,
          y: newSpeed.y * accelerationFactor
        });
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
      style={{ top: `${position.y}px`, left: `${position.x}px`, width: ball.size, height: ball.size }}
    />
  );
};

export default Ball;