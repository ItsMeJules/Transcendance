import React, { useEffect, useState } from "react";
import { Player } from "pages/Play/models/Player";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { GameProperties } from "pages/Play/models/Properties";
import getParseLocalStorage from "utils/getParseLocalStorage/getParseLocalStorage";
import { UserData } from "services/User/User";
import ConfettisComponent from "pages/Play/components/Confettis/ConfettisComponent";
import ScoreBoard from "pages/Play/components/ScoreBoard/ScoreBoard";
import { Ball } from "pages/Play/models/Ball";
import AllCanvas from "pages/Play/components/Canvas/AllCanvas";
import ProfilesHeader from "pages/Play/components/PlayersProfile/ProfilesHeader";
import NoGameSpectate from "./Components/NoGame/NoGameSpectate";

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
  const socket = useWebsocketContext();
  const whichPlayer = 0;
  const [player1Data, setPlayer1Data] = useState<UserData | null>(null);
  const [player2Data, setPlayer2Data] = useState<UserData | null>(null);
  const [isPlayerReady, ] = useState(false);

  const [gameState, setGameState] = useState<GameSocket>();
  const [game, setGame] = useState(new GameProperties());
  const [gameStatus, setGameStatus] = useState('');

  const [profileCardHeight, setProfileCardHeight] = useState(0);
  const [centralText, setCentralText] = useState('Waiting for players');

  // Data parsing
  useEffect(() => {
    const player1Data = getParseLocalStorage('player1Watch');
    const player2Data = getParseLocalStorage('player2Watch');
    setPlayer1Data(player1Data);
    setPlayer2Data(player2Data);
  }, [localStorage.getItem('player1Watch')]);

  // Sockets on
  useEffect(() => {
    socket.game?.on('prepareToPlay', (data: GameSocket) => {
      setNoGame(false);
      setGameState(data);
    });
    socket.game?.on('refreshGame', (data: GameSocket) => {
      setNoGame(false);
      setGameState(data);
    });
    socket.game?.on('noGame', (data: noGame) => {
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
        isPlayerReady={isPlayerReady} noGame={noGame} />

    <NoGameSpectate noGame={noGame} />
    </div >
  );

};

export default Spectate;
