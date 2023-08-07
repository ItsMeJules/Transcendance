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
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoresRef = useRef(scores);
  useEffect(() => {
    scoresRef.current = scores;
    console.log("Scores: ", scores);
  }, [scores]);

  const endGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTimeout(true);
    setIsGameStarted(false);
    const finalscores = scoresRef.current;
    if (finalscores.player1 > finalscores.player2) {
      setWinner("Winner: Player 1");
    } else if (finalscores.player1 < finalscores.player2) {
      setWinner("Winner: Player 2");
    } else {
      setWinner("TIE");
    }
  }, []);

  const updateScores = (player1: number, player2: number) => {
    setScores(prevScores => ({
      player1: prevScores.player1 + player1,
      player2: prevScores.player2 + player2
    }));
  };

  const resetGame = useCallback(() => {
    setTimer(10);
    setIsTimeout(false);
    setIsGameStarted(false);
    setPaddle1Top(110);
    setPaddle2Top(110);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setScores({ player1: 0, player2: 0 });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: { code: any; }) => {
      switch (event.code) {
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
    console.log("Game started");
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
        {isGameStarted && <Ball paddle1Top={paddle1Top} paddle2Top={paddle2Top} resetGame={resetGame} updateScores={updateScores} />}
        <div className="score-container">
          <div className="score">{scores.player1}</div>
          <div className="score">{scores.player2}</div>
        </div>
        {isTimeOut ? (
          <div className="time-out">TIME OUT<br />{winner}</div>
        ) : (
          <div className="timer">{timer}</div>
        )}
        {!isGameStarted && <button onClick={startGame}>Start</button>}
      </div>
    </div>
  );
};

export default GameBoard;