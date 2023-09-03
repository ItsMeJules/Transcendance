import React, { useEffect, useRef, useState } from "react";
import { Player } from "pages/Play/models/Player";
import BoardCanvas from "pages/Play/components/Canvas/BoardCanvas";
import BallCanvas from "pages/Play/components/Canvas/BallCanvas";
import PaddleCanvas from "pages/Play/components/Canvas/PaddleCanvas";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useNavigate } from "react-router-dom";
import { GameProperties } from "pages/Play/models/Properties";
import getParseLocalStorage from "utils/getParseLocalStorage/getParseLocalStorage";
import { UserData } from "services/User/User";
import ConfettisComponent from "pages/Play/components/Confettis/ConfettisComponent";
import LeftPlayerProfile from "pages/Play/components/PlayersProfile/LeftPlayerProfile";
import RightPlayerProfile from "pages/Play/components/PlayersProfile/RightPlayerProfile";
import MainText from "pages/Play/components/MainText/MainText";
import ScoreBoard from "pages/Play/components/ScoreBoard/ScoreBoard";
import { Ball } from "pages/Play/models/Ball";
import { APP_ROUTES } from "utils/routing/routing";
import AllCanvas from "pages/Play/components/Canvas/AllCanvas";
import ProfilesHeader from "pages/Play/components/PlayersProfile/ProfilesHeader";
import NoGameSpectate from "./Components/NoGame/NoGameSpectate";

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

interface SpectateProps {
  noGame: boolean;
  setNoGame: (noGame: boolean) => void;
}

const Spectate: React.FC<SpectateProps> = ({ noGame, setNoGame }) => {
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
  // const [noGame, setNoGame] = useState(false);
  const [gameStatus, setGameStatus] = useState('');

  const [profileCardHeight, setProfileCardHeight] = useState(0);
  const [centralText, setCentralText] = useState('Waiting for players');
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
      setNoGame(false);
      console.log('DATA PREPARE', data);
      setGameState(data);
    });
    socket.game?.on('refreshGame', (data: GameSocket) => {
      console.log('DATA game', data);
      setNoGame(false);
      setGameState(data);
    });
    socket.game?.on('noGame', (data: noGame) => {
      console.log('DATA no game', data);
      if (data.status === 'noGame') {
        setNoGame(true);
        setGameStatus('noGame');
      }
    });
    // if (!noGame)
    socket.game?.emit('watchGame', { gameId: -1 });
    return () => {
      socket.game?.off('prepareToPlay');
      socket.game?.off('refreshGame');
      socket.game?.off('noGame');
    };
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
      setCentralText('Player 1 wins!');
      if (gameState.gameParams.pl1.status === 'givenUp')
        setCentralText('Player 2 wins!');
      setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false });
    }
    else if (gameState?.gameStatus === 'ended') {
      setCentralText('Player 2 wins!');
      if (gameState.gameParams.pl1.isWinner === true)
        setCentralText('Player 1 wins!');
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
    if (gameStatus === 'noGame') {
      setCentralText('Select a game to watch');
      // history(APP_ROUTES.USER_PROFILE_ABSOLUTE);
    }
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
      // setTimeout(() => {
      // history(APP_ROUTES.MATCHMAKING_ABSOLUTE);
      // }, 3 * 1000);
    } else if (gameState?.gameStatus === 'playing') {
      socket.game?.off('prepareToPlay'); // dont off and use for status?
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

      <ProfilesHeader game={game} player1Data={player1Data} player2Data={player2Data} noGame={noGame} />

      <ScoreBoard game={game} noGame={noGame} />

      <AllCanvas game={game} socket={socket.game} whichPlayer={whichPlayer} centralText={centralText}
        isPlayerReady={isPlayerReady} profileCardHeight={profileCardHeight} noGame={noGame} />

    <NoGameSpectate noGame={noGame} />
      {/* <NoGameSpectate noGame={noGame} /> */}
    </div >
  );

};

export default Spectate;
