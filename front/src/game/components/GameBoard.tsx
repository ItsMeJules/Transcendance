import React, { useRef, useState, useEffect, useCallback } from 'react';
import Paddle from "./Paddle";
import Ball from "./Ball";
import { MdHeight } from 'react-icons/md';
import { useWebsocketContext } from '../../Wrappers/Websocket';

class GameProperties {
  gameBoardWidth: number;
  gameBoardHeight: number;
  ballSize: number;
  ballSpeed: number;
  ballPosX: number;
  ballPosY: number;
  paddleHeight: number;
  paddleWidth: number;
  accelerationFactor: number;
  paddleSpeed: number;

  constructor() {
    this.gameBoardWidth = window.innerWidth * 0.8;
    this.gameBoardHeight = this.gameBoardWidth * 0.5;
    this.ballSize = this.gameBoardWidth * 20 / 600;
    this.ballSpeed = this.gameBoardWidth * 2 / 600;
    this.ballPosX = this.gameBoardWidth / 2;
    this.ballPosY = this.gameBoardHeight / 2;
    this.paddleHeight = this.gameBoardHeight * 80 / 300;
    this.paddleWidth = this.gameBoardWidth * 20 / 600;
    this.paddleSpeed = this.gameBoardHeight * 10 / 300;
    this.accelerationFactor = 1;
  }

  updateDimensions() {
    this.gameBoardWidth = window.innerWidth * 0.8;
    this.gameBoardHeight = this.gameBoardWidth * 0.5;
    this.ballSize = this.gameBoardWidth * 20 / 600;
    this.ballSpeed = this.gameBoardWidth * 2 / 600;
    this.paddleHeight = this.gameBoardHeight * 80 / 300;
    this.paddleWidth = this.gameBoardWidth * 20 / 600;
  }
}

type Score = {
  player1: number;
  player2: number;
};

interface GameBoardProps {
  whichPlayer: string,
}

const GameBoard: React.FC<GameBoardProps> = ({ whichPlayer }) => {
  const gamePropertiesRef = useRef(new GameProperties());
  const gameProperties = gamePropertiesRef.current;

  const [timer, setTimer] = useState(60);
  const [isTimeOut, setIsTimeout] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [paddle1Top, setPaddle1Top] = useState(gameProperties.gameBoardHeight * 110 / 300);
  const [paddle2Top, setPaddle2Top] = useState(gameProperties.gameBoardHeight * 110 / 300);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [lastScorer, setLastScorer] = useState(false)
  const [isPlayer1Ready, setIsPlayer1Ready] = useState(false);
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [socketData, setSocketData] = useState('');
  const whichPlayerRef = useRef(whichPlayer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoresRef = useRef(scores);
  const socket = useWebsocketContext();
  const [centralText, setCentralText] = useState('');

  const handleReadyClick = () => {
    // console.log('Socket connected:', socket.game && socket.game.connected);

    if (whichPlayer === 'player1' && !isPlayer1Ready) {
      setIsPlayer1Ready(true);
      if (socket.game)
        socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'playPressed' });
    } else if (whichPlayer === 'player2' && !isPlayer2Ready) {
      if (socket.game)
        socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'playPressed' });
      setIsPlayer2Ready(true);
    }
  };

  useEffect(() => {
    socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'status' });
    socket.game?.on('prepareToPlay', (data) => {
      setSocketData(data);
      // console.log('DATA ', data);
    });
  }, [socket.game]);

  useEffect(() => {
    console.log('socketData:', socketData);
    if (socketData === 'pending') {
      setCentralText('Ready?');
    } else if (socketData === 'PLAY') {
      setIsPlayer1Ready(true);
      setIsPlayer2Ready(true);
      // setIsGameStarted(true);
      const countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown === 1) {
            clearInterval(countdownInterval);
            startGame();
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return;
  }, [socketData]);

  useEffect(() => {
    whichPlayerRef.current = whichPlayer;
  }, [whichPlayer]);

  const updateDimensions = () => {
    const oldGameBoardHeight = gameProperties.gameBoardHeight;

    gameProperties.updateDimensions();
    setPaddle1Top(prevPaddle1Top => (prevPaddle1Top / oldGameBoardHeight) * gameProperties.gameBoardHeight);
    setPaddle2Top(prevPaddle2Top => (prevPaddle2Top / oldGameBoardHeight) * gameProperties.gameBoardHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    scoresRef.current = scores;
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
    if (player1 > player2) {
      setLastScorer(true);
    } else if (player1 < player2) {
      setLastScorer(false);
    }
    setScores(prevScores => ({
      player1: prevScores.player1 + player1,
      player2: prevScores.player2 + player2
    }));
  };

  const resetGame = useCallback(() => {
    setTimer(60);
    setIsTimeout(false);
    setIsGameStarted(false);
    setPaddle1Top(gameProperties.gameBoardHeight * 110 / 300);
    setPaddle2Top(gameProperties.gameBoardHeight * 110 / 300);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setScores({ player1: 0, player2: 0 });
  }, []);

  // Utilisez useRef pour suivre l'état des touches
  const keysPressed = useRef({ w: false, s: false, ArrowUp: false, ArrowDown: false });

  // Gestionnaire d'événement pour enregistrer l'état des touches
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'w' || event.key === 's' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      keysPressed.current[event.key] = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'w' || event.key === 's' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      keysPressed.current[event.key] = false;
    }
  };

  // Créez une fonction pour mettre à jour les positions des paddles en fonction des touches enfoncées
  const updatePaddles = () => {
    const currentWhichPlayer = whichPlayerRef.current;
    if (currentWhichPlayer === 'player1') {
      if (keysPressed.current.w || keysPressed.current.ArrowUp) {
        setPaddle1Top(paddle1Top => Math.max(gameProperties.ballSize * 2, paddle1Top - gameProperties.paddleSpeed));
      }
      if (keysPressed.current.s || keysPressed.current.ArrowDown) {
        setPaddle1Top(paddle1Top => Math.min(gameProperties.gameBoardHeight - gameProperties.paddleHeight - (gameProperties.ballSize * 2), paddle1Top + gameProperties.paddleSpeed));
      }
    } else if (currentWhichPlayer === 'player2') {
      if (keysPressed.current.w || keysPressed.current.ArrowUp) {
        setPaddle2Top(paddle2Top => Math.max(gameProperties.ballSize * 2, paddle2Top - gameProperties.paddleSpeed));
      }
      if (keysPressed.current.s || keysPressed.current.ArrowDown) {
        setPaddle2Top(paddle2Top => Math.min(gameProperties.gameBoardHeight - gameProperties.paddleHeight - (gameProperties.ballSize * 2), paddle2Top + gameProperties.paddleSpeed));
      }
    }
  };

  useEffect(() => {
    // Ajoutez des écouteurs d'événements pour les touches enfoncées et relâchées
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const animatePaddles = () => {
      updatePaddles();
      requestAnimationFrame(animatePaddles);
    };
    // Commencez l'animation
    requestAnimationFrame(animatePaddles);

    // Supprimez les écouteurs d'événements au nettoyage
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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
    <div className="container" style={{ width: gameProperties.gameBoardWidth, height: gameProperties.gameBoardHeight }}>
      <div className="game-board" style={{ width: gameProperties.gameBoardWidth, height: gameProperties.gameBoardHeight }}>
        <Paddle top={paddle1Top} gameProperties={gameProperties} />
        <Paddle top={paddle2Top} gameProperties={gameProperties} />
        {isGameStarted &&
          <Ball
            gameProperties={gameProperties}
            paddle1Top={paddle1Top}
            paddle2Top={paddle2Top}
            resetGame={resetGame}
            updateScores={updateScores}
            lastScorer={lastScorer}
          />}
        <div className="score-container">
          <div className="score">{scores.player1}</div>
          <div className="score">{scores.player2}</div>
        </div>
        {isTimeOut ? (
          <div className="time-out">TIME OUT<br />{winner}</div>
        ) : (
          <div className="timer">{timer}</div>
        )}
        {!isGameStarted &&
          <button onClick={handleReadyClick}>

            {/* {whichPlayer === 'player1' ?
              (isPlayer1Ready ? "Waiting for Player 2" : "Ready?") :
              (isPlayer2Ready ? "Waiting for Player 1" : "Ready?")} */}
          </button>}
      </div>
    </div>
  );
};

export default GameBoard;
export { GameProperties };