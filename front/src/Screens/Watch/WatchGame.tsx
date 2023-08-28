import React, { useEffect, useRef, useState } from "react";
import { Player } from "../Play/models/Player";
import { Paddle } from "../Play/models/Paddle";
import GameBoard from "../Play/components/Canvas/BoardCanvas";
import { MDBContainer, MDBCard, MDBCardImage } from 'mdb-react-ui-kit';
import BoardCanvas from "../Play/components/Canvas/BoardCanvas";
import BallCanvas from "../Play/components/Canvas/BallCanvas";
import PaddleCanvas from "../Play/components/Canvas/PaddleCanvas";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useNavigate } from "react-router-dom";
import { Board } from "../Play/models/Board";
import { GameProperties } from "../Play/models/Properties";
import { SocketPrepare } from "../Play/models/socket.prepare";
import getParseLocalStorage from "../../Utils/getParseLocalStorage";
import { UserData } from "../../Services/User";
import confettisAnimation from '../Play/components/Confettis/confettis'
import ConfettisComponent from "../Play/components/Confettis/ConfettisComponent";
import LeftPlayerProfile from "../Play/components/PlayersProfile/LeftPlayerProfile";
import RightPlayerProfile from "../Play/components/PlayersProfile/RightPlayerProfile";
import MainText from "../Play/components/MainText/MainText";
import GiveUp from "../Play/components/GiveUp/GiveUp";
import ScoreBoard from "../Play/components/ScoreBoard/ScoreBoard";
import { Ball } from "../Play/models/Ball";

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

const WatchGame = () => {
  const boardCanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const ballCanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const paddle1CanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const paddle2CanvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const socket = useWebsocketContext();
  const whichPlayer = 0;
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
    const userData = getParseLocalStorage('userDataWatch');
    const player1Data = getParseLocalStorage('player1Watch');
    const player2Data = getParseLocalStorage('player2Watch');
    setPlayer1Data(player1Data);
    setPlayer2Data(player2Data);
  }, []);

  // Sockets on
  useEffect(() => {
    socket.game?.on('prepareToPlay', (data: GameSocket) => {
      console.log('DATA PREPARE', data);
      setGameState(data);
    });
    socket.game?.on('refreshGame', (data: GameSocket) => {
      console.log('DATA game', data);
      setGameState(data);
    });
    socket.game?.on('noGame', (data: noGame) => {
      console.log('DATA no game', data);
      if (data.status === 'noGame')
        setGameStatus('noGame');
    });
    socket.game?.emit('watchGame', { gameId: -1 });
  }, [socket.game]);

  // Game useEffect
  useEffect(() => {
    if (gameState?.gameStatus) {
      setGameStatus(gameState?.gameStatus);
      game.pl1.score = gameState.gameParams.pl1.score === -1 ? 0 : gameState.gameParams.pl1.score;
      game.pl2.score = gameState.gameParams.pl2.score === -1 ? 0 : gameState.gameParams.pl2.score;
      setGame({ ...game });
    }
    if (gameState?.gameStatus === 'giveUp') {
      game.isPlaying = false;
      if (gameState.gameParams.pl1.status === 'givenUp')
        setCentralText('Player 2 wins!');
      else
        setCentralText('Player 1 wins!');
      setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false });
    }
    else if (gameState?.gameStatus === 'ended') {
      if (gameState.gameParams.pl1.isWinner === true)
        setCentralText('Player 1 wins!');
      else
        setCentralText('Player 2 wins!');
      setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false });
    }
    else if (gameState) {
      game.ball.updateBall(game.board, gameState.gameParams.ball);
      game.pl1.updatePlayer(game.board, gameState.gameParams.pl1);
      game.pl2.updatePlayer(game.board, gameState.gameParams.pl2);
    }
  }, [gameState]);

  // Prepare useEffect
  useEffect(() => {
    if (gameStatus === 'noGame')
      history('/test');
    if (gameState?.gameStatus) setGameStatus(gameState?.gameStatus);
    if (gameState?.gameStatus === 'pending' || gameState?.gameStatus === 'pending') {
      setCentralText('Waiting for players');
    } else if (gameState?.gameStatus === 'countdown') {
      if (gameState.countdown) {
        setCentralText(gameState.countdown);
      } else
        setCentralText('Get ready!');
    } else if (gameState?.gameStatus === 'timeout') {
      setCentralText('Timeout - game canceled')
      setTimeout(() => {
        history('/test'); // or online games
      }, 3 * 1000);
    } else if (gameState?.gameStatus === 'playing') {
      socket.game?.off('prepareToPlay'); // dont off and use for status?
      game.isPlaying = true;
      setGame({ ...game, isPlaying: true });
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

export default WatchGame;
