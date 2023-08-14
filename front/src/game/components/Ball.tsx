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
  const { gameBoardWidth, gameBoardHeight, ballSize, ballSpeed, paddleHeight, paddleWidth, ballPosX, ballPosY} = gameProperties;
  let accelerationFactor = gameProperties.accelerationFactor;

  const [speed, setSpeed] = useState({ x: ballSpeed, y: ballSpeed });
  const [position, setPosition] = useState({ x: ballPosX, y: ballPosY });
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
    const randomY = Math.random() * gameBoardHeight;
    const isUpperHalf = randomY < gameBoardHeight / 2;

    setPosition({ x: gameBoardWidth / 2, y: randomY });

    const xDirection = lastScorer ? -ballSpeed : ballSpeed;
    const yDirection = isUpperHalf ? ballSpeed : -ballSpeed;

    setSpeed({ x: xDirection, y: yDirection });
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
      if (newPosX - ballSize / 2 <= 0) {
        updateScores(0, 1);
        resetBall();
      } else if (newPosX + ballSize / 2 >= gameBoardWidth) {
        updateScores(1, 0);
        resetBall();
      } else if ((speed.x < 0 && newPosX - ballSize / 2 <= paddleWidth && newPosY + ballSize / 2 >= paddle1Top && newPosY - ballSize / 2 <= paddle1Top + paddleHeight) ||
        (speed.x > 0 && newPosX + ballSize / 2 >= gameBoardWidth - paddleWidth && newPosY + ballSize / 2 >= paddle2Top && newPosY - ballSize / 2 <= paddle2Top + paddleHeight)) {
        // Get the new angle and speed based on the paddle hit
        const incidentAngle = Math.atan2(speed.y, speed.x);
        // Calculate the hit point on the paddle
        const paddleY = speed.x < 0 ? paddle1Top : paddle2Top;
        // Calculate the reflection modifier based on the hit point
        const reflectionModifier = calculateAngle(newPosY, paddleY, paddleHeight);
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
      style={{ top: `${position.y}px`, left: `${position.x}px`, width: ballSize, height: ballSize }}
    />
  );
};

export default Ball;