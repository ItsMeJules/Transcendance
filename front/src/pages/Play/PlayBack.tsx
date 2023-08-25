import React, { useEffect, useRef, useState } from "react";
import { Point, Vector } from "./components/BallOld";
import { BallNew, GameBoardNew, Player, PaddleNew } from '../../minigame/models';
import GameBoard from "./components/Board";
import BoardCanvas from "./components/Board";
import BallCanvas from "./components/Ball";
import PaddleCanvas from "./components/Paddle";
import { useWebsocketContext } from "../../services/Websocket";
import { useNavigate } from "react-router-dom";

class GameProperties {
  public isStarted = false;
  public board: GameBoardNew;
  public ball: BallNew;
  public pl1: Player;
  public pl2: Player;

  constructor() {
    this.board = new GameBoardNew(window.innerWidth * 0.8);
    this.ball = new BallNew(this.board);
    this.pl1 = new Player(this.board, 1);
    this.pl2 = new Player(this.board, 2);
  }
}

interface SocketData {
  gameStatus: string;
  playerStatus: string;
  opponentStatus: string;
  countdown: string;
}

interface PlayBackProps {
  whichPlayer: number,
}

const PlayBack: React.FC<PlayBackProps> = ({ whichPlayer }) => {
  const gameRef = useRef(new GameProperties());
  const [game, setGame] = useState(gameRef.current);
  const canvasRef = useRef<HTMLCanvasElement | null | undefined>();
  const socket = useWebsocketContext();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);
  const [socketData, setSocketData] = useState<SocketData>();
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
    // if (!socketData) history('/test');
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
    } else if (socketData?.gameStatus === 'canceled') {
      history('/test');
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.8;
      const factor = gameRef.current.board.updateDimensions(newWidth);
      gameRef.current.ball.updateBall(factor);
      gameRef.current.pl1.pad.updatePaddle(factor);
      gameRef.current.pl2.pad.updatePaddle(factor);
      setGame({ ...game });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ height: '30px', marginBottom: '10px', marginTop: '150px' }}>
        {!isGameStarted && !isPlayerReady &&
          <button className="text-white" onClick={handleReadyClick} >
            {centralText}
          </button>}
        {!isGameStarted && isPlayerReady &&
          <div className="text-white">
            {centralText}
          </div>}
      </div>

      <div className="pong-game border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '400px' }}>
        <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} id="pongCanvas" width="800" height="600">
          <BoardCanvas board={game.board} canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>} />
          <PaddleCanvas board={game.board} player={game.pl1} canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>} />
          <PaddleCanvas board={game.board} player={game.pl2} canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>} />
          <BallCanvas board={game.board} ball={game.ball} canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>} />
        </canvas>
      </div>

    </div>
  );

};

export default PlayBack;
