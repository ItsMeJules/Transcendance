import React, { useEffect, useRef, useState } from "react";
import { Point, Vector } from "./components/Olds/BallOld";
import { Ball } from "./models/Ball";
import { Player } from "./models/Player";
import { Paddle } from "./models/Paddle";
import GameBoard from "./components/BoardCanvas";
import BoardCanvas from "./components/BoardCanvas";
import BallCanvas from "./components/BallCanvas";
import PaddleCanvas from "./components/PaddleCanvas";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useNavigate } from "react-router-dom";
import { Board } from "./models/Board";
import { GameProperties } from "./models/Properties";
import { SocketPrepare } from "./models/socket.prepare";
import getParseLocalStorage from "../../Utils/getParseLocalStorage";
import { UserData } from "../../Services/User";

interface PlayBackProps {
  whichPlayer: number,
}

interface GameState {
  pl1: Player;
  pl2: Player;
  ball: Ball;
}

interface GameSocket {
  gameState: GameState;
  gameStatus: string;
  playerStatus: string;
  opponentStatus: string;
  time: number;
}

const PlayBack = () => {
  const [game, setGame] = useState(new GameProperties());
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
  const [socketPrepare, setSocketPrepare] = useState<SocketPrepare>();
  const [gameState, setGameState] = useState<GameSocket>();
  const [centralText, setCentralText] = useState('');

  // const [ballProperties, setBallProperties] = useState({
  //   pos: new Point(0, 0), // Initial values
  //   dir: new Vector(0, 0),
  //   // ...other ball properties you want to track
  // });

  const history = useNavigate();

  const handleReadyClick = () => {
    if (!isPlayerReady) {
      setIsPlayerReady(true);
      if (socket.game)
        socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'playPressed' });
    }
  };

  useEffect(() => {
    const userData = getParseLocalStorage('userData');
    const gameData = getParseLocalStorage('gameData');
    const player1Data = getParseLocalStorage('player1');
    const player2Data = getParseLocalStorage('player2');
    const gameVCannel = getParseLocalStorage('gameChannel');
    setPlayer1Data(player1Data);
    setPlayer2Data(player2Data);
    if (player1Data.id === userData.id)
      setWhichPlayer(1);
    else
      setWhichPlayer(2);
  }, []);

  useEffect(() => {
    socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'status' });
    socket.game?.on('prepareToPlay', (data) => {
      setSocketPrepare(data);
      // console.log('DATA PREPARE', data);
    });
    socket.game?.on('gameChannel', (data) => {
      // setBallProperties({
      //   pos: new Point(data.ballX, data.ballY),
      //   dir: new Vector(data.ballDirX, data.ballDirY),
      //   // ...update other properties accordingly
      // });
      setGameState(data);
      console.log('gamestate ball:', gameState?.gameState.ball);
      // game.ball.updateBall(game.board, gameState)
      console.log('DATA game', data);
    });
  }, [socket.game]);

  useEffect(() => {
    console.log('gamestate ball:', gameState?.gameState.ball);
    if (gameState) {
      game.ball.updateBall(game.board, gameState.gameState.ball);
      console.log('refreshed ball:', game.ball);
    }
  }, [gameState]);

  useEffect(() => {
    // console.log('socketData:', socketPrepare);
    if (socketPrepare?.gameStatus === 'pending' || socketPrepare?.playerStatus === 'pending') {
      setCentralText('Ready?');
    } else if (socketPrepare?.gameStatus === 'waiting'
      && socketPrepare.playerStatus === 'ready'
      && socketPrepare.opponentStatus === 'pending') {
      setIsPlayerReady(true);
      setCentralText('Waiting for opponent');
    } else if (socketPrepare?.gameStatus === 'countdown') {
      setIsOpponentReady(true);
      if (socketPrepare.countdown) {
        setCentralText(socketPrepare.countdown);
      } else
        setCentralText('Get ready!');
    } else if (socketPrepare?.gameStatus === 'canceled') {
      history('/test');
    } else if (socketPrepare?.gameStatus === 'timeout') {
      setCentralText('Timeout - game canceled')
      setTimeout(() => {
        history('/test');
      }, 3 * 1000);
    } else if (socketPrepare?.gameStatus === 'playing') {
      socket.game?.off('prepareToPlay');
      game.isStarted = true;
      setGame({ ...game, isStarted: true });
    }
    return;
  }, [socketPrepare]);

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
      <div className="pong-sub-container text-white border">

        <div style={{ height: '30px', marginBottom: '10px', marginTop: '0px' }}>
          {!game.isStarted && !isPlayerReady &&
            <button className="text-white" onClick={handleReadyClick} >
              {centralText}
            </button>}
          {!game.isStarted && isPlayerReady &&
            <div className="text-white">
              {centralText}
            </div>}
        </div>

        <div className="pong-game-canvas">
          <canvas ref={boardCanvasRef as React.RefObject<HTMLCanvasElement>} id="boardCanvas" width={game.board.width} height={game.board.height} className="canvas-container-board" />
          <canvas ref={ballCanvasRef as React.RefObject<HTMLCanvasElement>} id="ballCanvas" width={game.board.width} height={game.board.height} className="canvas-container-ball" />
          {/* <canvas ref={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} id="paddleCanvas" width={game.board.width} height={game.board.height} className="canvas-container-paddle" /> */}
          {/* <canvas ref={paddle2CanvasRef as React.RefObject<HTMLCanvasElement>} id="paddleCanvas" width={game.board.width} height={game.board.height} className="canvas-container-paddle" /> */}
        </div>
        <BoardCanvas game={game} canvasRef={boardCanvasRef as React.RefObject<HTMLCanvasElement>} />
        <BallCanvas game={game} ball={game.ball} canvasRef={ballCanvasRef as React.RefObject<HTMLCanvasElement>} />
        {/* <PaddleCanvas board={game.board} player={game.pl1} canvasRef={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} />
        <PaddleCanvas board={game.board} player={game.pl2} canvasRef={paddle1CanvasRef as React.RefObject<HTMLCanvasElement>} /> */}
      </div>
    </div >
  );

};

export default PlayBack;
