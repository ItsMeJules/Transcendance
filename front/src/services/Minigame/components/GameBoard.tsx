import React, { useRef, useState, useEffect, useCallback } from 'react';
// import Paddle from "./Paddle";
import Ball from "./Ball";
import { MdHeight } from 'react-icons/md';
import { useWebsocketContext } from '../../Websocket/Websocket';
import { useNavigate } from 'react-router-dom';
import { BallNew, GameBoardNew, Player, PaddleNew } from '../models';

class GameProperties {
  public gameBoard: GameBoardNew;
  public ball: BallNew;
  // public paddle: PaddleNew;
  // public player1: Player;
  // public player2: Player;
  
  constructor() {
    this.gameBoard = new GameBoardNew(window.innerWidth * 0.8);
    this.ball = new BallNew(this.gameBoard);
    // this.paddle = new PaddleNew(this.gameBoard);
    // this.player1 = new Player(this.gameBoard);
    // this.player2 = new Player(this.gameBoard);
  }

  updateDimensions() {
    this.gameBoard.updateDimensions(window.innerWidth * 0.8);
    // this.ball.updateBall(this.gameBoard);
    // this.paddle.updatePaddle(this.gameBoard);
  }
}

interface GameBoardProps {
  whichPlayer: string,
}

interface SocketData {
  gameStatus: string;
  playerStatus: string;
  opponentStatus: string;
  countdown: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ whichPlayer }) => {
  const gamePropertiesRef = useRef(new GameProperties());
  const [gameProperties, setGameProperties] = useState(gamePropertiesRef.current);

  const [timer, setTimer] = useState(60);
  const [isTimeOut, setIsTimeout] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [lastScorer, setLastScorer] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [socketData, setSocketData] = useState<SocketData>();
  const whichPlayerRef = useRef(whichPlayer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scoresRef = useRef(scores);
  const socket = useWebsocketContext();
  const [centralText, setCentralText] = useState('');
  const history = useNavigate();

  const handleReadyClick = () => {
    if (!isPlayerReady) {
      setIsPlayerReady(true);
      if (socket.game)
        socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'playPressed' });
    }
  };

  useEffect(() => {
    socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'status' });
    socket.game?.on('prepareToPlay', (data) => {
      setSocketData(data);
      console.log('DATA ', data);
    });
  }, [socket.game]);

  useEffect(() => {
    console.log('socketData:', socketData);
    if (socketData?.gameStatus === 'pending' || socketData?.playerStatus === 'pending') {
      setCentralText('Ready?');
    } else if (socketData?.gameStatus === 'waiting'
      && socketData.playerStatus === 'ready'
      && socketData.opponentStatus === 'pending') {
      setIsPlayerReady(true);
      setCentralText('Waiting for opponent');
    } else if (socketData?.gameStatus === 'countdown') {
      setIsOpponentReady(true);
      if (socketData.countdown) {
        setCentralText(socketData.countdown);
      } else
        setCentralText('Get ready!');
    } else if (socketData?.gameStatus === 'timeout') {
      setCentralText('Timeout - game canceled')
      setTimeout(() => {
        history('/test');
      }, 3 * 1000);
    } else if (socketData?.gameStatus === 'playing')
      setIsGameStarted(true);
    return;
  }, [socketData]);

  useEffect(() => {
    whichPlayerRef.current = whichPlayer;
  }, [whichPlayer]);

  const updateDimensions = () => {
    const oldGameBoardHeight = gameProperties.gameBoard.height;

    gameProperties.updateDimensions();
    // gameProperties.player1.updatePaddleTop(oldGameBoardHeight, gameProperties.gameBoard.height);
    // gameProperties.player2.updatePaddleTop(oldGameBoardHeight, gameProperties.gameBoard.height);
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
    // gameProperties.player1.resetPaddleTop(gameProperties.gameBoard);
    // gameProperties.player2.resetPaddleTop(gameProperties.gameBoard);
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
    setGameProperties(prevGameProperties => {
      const currentWhichPlayer = whichPlayerRef.current;
      const updatedGameProperties = new GameProperties(); // Create a new instance
  
      updatedGameProperties.gameBoard = prevGameProperties.gameBoard; // Copy over properties
      updatedGameProperties.ball = prevGameProperties.ball;
      // updatedGameProperties.paddle = prevGameProperties.paddle;
      // updatedGameProperties.player1 = prevGameProperties.player1;
      // updatedGameProperties.player2 = prevGameProperties.player2;
  
      if (currentWhichPlayer === 'player1') {
        if (keysPressed.current.w || keysPressed.current.ArrowUp) {
          const newPaddle1Top = Math.max(
            updatedGameProperties.ball.size * 2,
            // updatedGameProperties.player1.posPaddleTop - updatedGameProperties.paddle.speed
          );
          // updatedGameProperties.player1.posPaddleTop = newPaddle1Top;
        }
        if (keysPressed.current.s || keysPressed.current.ArrowDown) {
          const newPaddle1Top = Math.min(
            // updatedGameProperties.gameBoard.height - updatedGameProperties.paddle.height - (updatedGameProperties.ball.size * 2),
            // updatedGameProperties.player1.posPaddleTop + updatedGameProperties.paddle.speed
          );
          // updatedGameProperties.player1.posPaddleTop = newPaddle1Top;
        }
      } else if (currentWhichPlayer === 'player2') {
        if (keysPressed.current.w || keysPressed.current.ArrowUp) {
          const newPaddle2Top = Math.max(
            updatedGameProperties.ball.size * 2,
            // updatedGameProperties.player2.posPaddleTop - updatedGameProperties.paddle.speed
          );
          // updatedGameProperties.player2.posPaddleTop = newPaddle2Top;
        }
        if (keysPressed.current.s || keysPressed.current.ArrowDown) {
          const newPaddle2Top = Math.min(
            // updatedGameProperties.gameBoard.height - updatedGameProperties.paddle.height - (updatedGameProperties.ball.size * 2),
            // updatedGameProperties.player2.posPaddleTop + updatedGameProperties.paddle.speed
          );
          // updatedGameProperties.player2.posPaddleTop = newPaddle2Top;
        }
      }
  
      return updatedGameProperties;
    });
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
    <div className="container" style={{ width: gameProperties.gameBoard.width, height: gameProperties.gameBoard.height }}>
      <div className="game-board" style={{ width: gameProperties.gameBoard.width, height: gameProperties.gameBoard.height }}>
        {/* <Paddle top={gameProperties.player1.posPaddleTop} gameProperties={gameProperties} />
        <Paddle top={gameProperties.player2.posPaddleTop} gameProperties={gameProperties} /> */}
        {/* {isGameStarted &&
          <Ball
            gameProperties={gameProperties}
            paddle1Top={gameProperties.player1.posPaddleTop}
            paddle2Top={gameProperties.player2.posPaddleTop}
            resetGame={resetGame}
            updateScores={updateScores}
            lastScorer={lastScorer}
          />} */}
        <div className="score-container">
          <div className="score">{scores.player1}</div>
          <div className="score">{scores.player2}</div>
        </div>
        {isTimeOut ? (
          <div className="time-out">TIME OUT<br />{winner}</div>
        ) : (
          <div className="timer">{timer}</div>
        )}
        {!isGameStarted && !isPlayerReady &&
          <button onClick={handleReadyClick}>
            {centralText}
          </button>}
        {!isGameStarted && isPlayerReady &&
          <div>
            {centralText}
          </div>}
      </div>
    </div>
  );
};

export default GameBoard;
export { GameProperties };
