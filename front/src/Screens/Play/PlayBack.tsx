import React, { useEffect, useRef, useState } from "react";
import { Ball } from "./models/Ball";
import { Player } from "./models/Player";
import { Paddle } from "./models/Paddle";
import GameBoard from "./components/Canvas/BoardCanvas";
import { MDBContainer, MDBCard, MDBCardImage } from 'mdb-react-ui-kit';
import BoardCanvas from "./components/Canvas/BoardCanvas";
import BallCanvas from "./components/Canvas/BallCanvas";
import PaddleCanvas from "./components/Canvas/PaddleCanvas";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useNavigate } from "react-router-dom";
import { Board } from "./models/Board";
import { GameProperties } from "./models/Properties";
import { SocketPrepare } from "./models/socket.prepare";
import getParseLocalStorage from "../../Utils/getParseLocalStorage";
import { UserData } from "../../Services/User";
import confettisAnimation from './components/Confettis/confettis'
import ConfettisComponent from "./components/Confettis/ConfettisComponent";
import LeftPlayerProfile from "./components/PlayersProfile/LeftPlayerProfile";
import RightPlayerProfile from "./components/PlayersProfile/RightPlayerProfile";
import MainText from "./components/MainText/MainText";
import GiveUp from "./components/GiveUp/GiveUp";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";

interface PlayBackProps {
  whichPlayer: number,
}

interface GameParams {
  pl1: Player;
  pl2: Player;
  ball: Ball;
}

export interface GameSocket {
  gameStatus: string;
  gameParams: GameParams;
  playerStatus: string;
  opponentStatus: string;
  time: number;
  countdown: string;
}

interface noGame {
  status: string;
}

const PlayBack = () => {
  const boardCanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const ballCanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const paddle1CanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const paddle2CanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const socket = useWebsocketContext();
  const [whichPlayer, setWhichPlayer] = useState(0);
  const [player1Data, setPlayer1Data] = useState<UserData | null>(null);
  const [player2Data, setPlayer2Data] = useState<UserData | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);

  // const [socketPrepare, setSocketPrepare] = useState<SocketPrepare>();
  const [gameState, setGameState] = useState<GameSocket>();
  const [game, setGame] = useState(new GameProperties());
  const [gameStatus, setGameStatus] = useState('');

  const [profileCardHeight, setProfileCardHeight] = useState(0);
  const [centralText, setCentralText] = useState('');
  const history = useNavigate();

  // Data parsing
  useEffect(() => {
    const userData = getParseLocalStorage('userData');
    const player1Data = getParseLocalStorage('player1');
    const player2Data = getParseLocalStorage('player2');
    setPlayer1Data(player1Data);
    setPlayer2Data(player2Data);
    if (player1Data !== null && player2Data != null) {
      if (player1Data.id === userData.id)
        setWhichPlayer(1);
      else
        setWhichPlayer(2);
    }
    // Retrieve the height value

  }, []);

  // Sockets on
  useEffect(() => {
    socket.game?.on('prepareToPlay', (data: GameSocket) => {
      console.log('DATA PREPARE', data);
      setGameState(data);
    });
    socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'status' });
    socket.game?.on('refreshGame', (data: GameSocket) => {
      console.log('DATA game', data);
      setGameState(data);
    });
    socket.game?.on('noGame', (data: noGame) => {
      console.log('DATA no game', data);
      if (data.status === 'noGame')
        setGameStatus('noGame');
    });
  }, [socket.game]);

  // Game useEffect
  useEffect(() => {
    // console.log('gamestate:', gameState);
    if (gameState?.gameStatus) {
      // console.log('1111111111111');
      setGameStatus(gameState?.gameStatus);
      game.pl1.score = gameState.gameParams.pl1.score === -1 ? 0 : gameState.gameParams.pl1.score;
      game.pl2.score = gameState.gameParams.pl2.score === -1 ? 0 : gameState.gameParams.pl2.score;
      setGame({ ...game });
    }
    if (gameState?.gameStatus === 'giveUp') {
      // console.log('222222222');
      game.isPlaying = false;
      if ((gameState.gameParams.pl1.status === 'givenUp' && whichPlayer === 2)
        || (gameState.gameParams.pl2.status === 'givenUp' && whichPlayer === 1)) {
        setCentralText('Your opponent gave up!');
        setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false });
      } else {
        setCentralText('You gave up :(');
        setGame({ ...game, isEnded: true });
      }
    }
    else if (gameState?.gameStatus === 'ended') {
      // console.log('33333333333');
      if ((gameState.gameParams.pl1.isWinner === true && whichPlayer === 1)
        || (gameState.gameParams.pl2.isWinner === true && whichPlayer === 2)) {
        setCentralText('You win!!');
        setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false });
      } else {
        setCentralText('You lose...');
        setGame({ ...game, isEnded: true, isPlaying: false });
      }
    }
    else if (gameState) {
      // console.log('444444444444444444');
      game.ball.updateBall(game.board, gameState.gameParams.ball);
      game.pl1.updatePlayer(game.board, gameState.gameParams.pl1);
      game.pl2.updatePlayer(game.board, gameState.gameParams.pl2);
    }
  }, [gameState]);

  // Prepare useEffect
  useEffect(() => {
    // console.log('socketDataPrepare:', gameState);
    if (gameStatus === 'noGame')
      history('/test');
    if (gameState?.gameStatus) setGameStatus(gameState?.gameStatus);
    if (gameState?.gameStatus === 'pending' || gameState?.playerStatus === 'pending') {
      setCentralText('Ready?');
    } else if (gameState?.gameStatus === 'waiting'
      && gameState.playerStatus === 'ready'
      && gameState.opponentStatus === 'pending') {
      setIsPlayerReady(true);
      setCentralText('Waiting for opponent');
    } else if (gameState?.gameStatus === 'countdown') {
      setIsOpponentReady(true);
      setIsPlayerReady(true);
      if (gameState.countdown) {
        setCentralText(gameState.countdown);
      } else
        setCentralText('Get ready!');
    } else if (gameState?.gameStatus === 'timeout') {
      setCentralText('Timeout - game canceled')
      setTimeout(() => {
        history('/test');
      }, 3 * 1000);
    } else if (gameState?.gameStatus === 'playing') {
      socket.game?.off('prepareToPlay'); // dont off and use for status?
      game.isPlaying = true;
      setGame({ ...game, isPlaying: true });
      // socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'refreshInMotion' });
    }
    return;
  }, [gameState, gameStatus]);

  // Window resizing
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.8;
      const factor = game.board.updateDimensions(newWidth);
      setGame({ ...game });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='pong-main-container'>

      <ConfettisComponent gameIsEnded={game.isEnded} userIsWinner={game.isUserWinner} />

      <article className='profile-infos-container glow-border' id='profile-card' style={{ width: `${game.board.width}px` }}>
        <LeftPlayerProfile player1Data={player1Data} />
        <div className="versus-text" style={{ verticalAlign: 'center' }}>VS</div>
        <RightPlayerProfile player2Data={player2Data} />
      </article>

      <ScoreBoard game={game} />


      <div className="pong-sub-container text-white">
        <div className="pong-game-canvas" id='pong-canvas-container' style={{ height: `${game.board.height + 80}px` }}>
          <MainText textToDisplay={centralText} socket={socket.game}
            whichPlayer={whichPlayer} gameIsPlaying={game.isPlaying}
            isPlayerReady={isPlayerReady} game={game}
            elementHeight={profileCardHeight} gameStatus={gameStatus} />
          <canvas ref={boardCanvasRef as React.RefObject<HTMLCanvasElement>} id="boardCanvas" width={game.board.width} height={game.board.height} className="canvas-container-board" />
          <canvas ref={ballCanvasRef as React.RefObject<HTMLCanvasElement>} id="ballCanvas" width={game.board.width} height={game.board.height} className="canvas-container-ball" />
          <canvas ref={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} id="paddleCanvas" width={game.board.width} height={game.board.height} className="canvas-container-paddle" />
          <canvas ref={paddle2CanvasRef as React.RefObject<HTMLCanvasElement>} id="paddleCanvas" width={game.board.width} height={game.board.height} className="canvas-container-paddle" />
        </div>
        <BoardCanvas game={game} canvasRef={boardCanvasRef as React.RefObject<HTMLCanvasElement>} />
        <BallCanvas whichPlayer={whichPlayer} game={game} ball={game.ball} canvasRef={ballCanvasRef as React.RefObject<HTMLCanvasElement>} />
        <PaddleCanvas game={game} player={game.pl1} canvasRef={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} whichPlayer={whichPlayer} socket={socket.game} />
        <PaddleCanvas game={game} player={game.pl2} canvasRef={paddle2CanvasRef as React.RefObject<HTMLCanvasElement>} whichPlayer={whichPlayer} socket={socket.game} />
      </div>

      <GiveUp socket={socket.game} whichPlayer={whichPlayer} gameIsEnded={game.isEnded}></GiveUp>

    </div >
  );

};

export default PlayBack;
