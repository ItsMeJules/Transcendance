import React, { useRef, useState, useEffect, useCallback } from 'react';
import Paddle from "./Paddle";
import Ball from "./Ball";

const GameBoard = () => {
  const gameBoardWidth = 600;
  const gameBoardHeight = 300;
  const paddleWidth = 20;
  const paddleHeight = 80;
  const ballSize = 20;
  
  const [timer, setTimer] = useState(10);
  const [isTimeOut, setIsTimeout] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [paddle1Top, setPaddle1Top] = useState(110);
  const [paddle2Top, setPaddle2Top] = useState(110);
 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const endGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTimeout(true);
    setIsGameStarted(false);
  }, []);

  const resetGame = useCallback(() => {
    setTimer(10);
    setIsTimeout(false);
    setIsGameStarted(false);
    setPaddle1Top(110);
    setPaddle2Top(110);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: { code: any; }) => {
      switch(event.code) {
        case "KeyW":
          setPaddle1Top(paddle1Top => Math.max(ballSize * 2, paddle1Top - 10));
          break;
        case "KeyS":
          setPaddle1Top(paddle1Top => Math.min(gameBoardHeight - paddleHeight - (ballSize * 2), paddle1Top + 10));
          break;
        case "ArrowUp":
          setPaddle2Top(paddle2Top => Math.max(ballSize * 2, paddle2Top - 10));
          break;
        case "ArrowDown":
          setPaddle2Top(paddle2Top => Math.min(gameBoardHeight - paddleHeight - (ballSize * 2), paddle2Top + 10));
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const startGame = () => {
    resetGame();
    setIsGameStarted(true);

    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          endGame();
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
  };

  return (
    <div className="container">
      <div className="game-board">
        <Paddle top={paddle1Top} />
        <Paddle top={paddle2Top} />
        {isGameStarted && <Ball paddle1Top={paddle1Top} paddle2Top={paddle2Top} resetGame={resetGame} />}
        {isTimeOut ? (
          <div className="time-out">TIME OUT</div>
        ) : (
          <div className="timer">{timer}</div>
        )}
        {!isGameStarted && <button onClick={startGame}>Start</button>}
      </div>
	</div>
  );
};

export default GameBoard;