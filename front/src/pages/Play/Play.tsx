import { useEffect, useState } from "react";
import { Ball } from "./models/Ball";
import { Player } from "./models/Player";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useNavigate } from "react-router-dom";
import { GameProperties } from "./models/Properties";
import getParseLocalStorage from "utils/getParseLocalStorage/getParseLocalStorage";
import { UserData } from "services/User/User";
import ConfettisComponent from "./components/Confettis/ConfettisComponent";
import GiveUp from "./components/GiveUp/GiveUp";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import './css/Play.scss'
import { APP_ROUTES } from "utils/routing/routing";
import ProfilesHeader from "./components/PlayersProfile/ProfilesHeader";
import AllCanvas from "./components/Canvas/AllCanvas";
import NoGame from "./components/NoGame/NoGame";

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

const Play = () => {
  const socket = useWebsocketContext();
  const [whichPlayer, setWhichPlayer] = useState(0);
  const [player1Data, setPlayer1Data] = useState<UserData | null>(null);
  const [player2Data, setPlayer2Data] = useState<UserData | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);

  // const [socketPrepare, setSocketPrepare] = useState<SocketPrepare>();
  const [gameStatePrepare, setGameStatePrepare] = useState<GameSocket>();
  const [gameStatePlay, setGameStatePlay] = useState<GameSocket>();
  const [game, setGame] = useState(new GameProperties());
  const [noGame, setNoGame] = useState(false);

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
    if (player1Data !== null && player2Data !== null) {
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
      console.log('prepare:', data);
      setGameStatePrepare(data);
    });
    socket.game?.on('refreshGame', (data: GameSocket) => {
      console.log('Play:', data);
      setGameStatePlay(data);
    });
    socket.game?.on('noGame', (data: noGame) => {
      if (data.status === 'noGame') {
        console.log('NoGame on');
        setNoGame(true);
        setGame({ ...game, status: 'noGame' })
      }
    });
    socket.game?.emit('prepareToPlay', { player: whichPlayer, action: 'status' });

    return () => {
      socket.game?.off('prepareToPlay');
      socket.game?.off('refreshGame');
      socket.game?.off('noGame');
    };
  }, [socket.game]);

  // Game useEffect
  useEffect(() => {
    // console.log('Play:', gameStatePlay);
    if (gameStatePlay?.gameStatus) {
      game.pl1.score = gameStatePlay.gameParams.pl1.score === -1 ? 0 : gameStatePlay.gameParams.pl1.score;
      game.pl2.score = gameStatePlay.gameParams.pl2.score === -1 ? 0 : gameStatePlay.gameParams.pl2.score;
      setGame({ ...game, status: gameStatePlay?.gameStatus });
    }
    if (gameStatePlay?.gameStatus === 'giveUp') {
      console.log('1 P GIVEUP whichPlayer:', whichPlayer);
      if ((gameStatePlay.gameParams.pl1.status === 'givenUp' && whichPlayer === 2)
        || (gameStatePlay.gameParams.pl2.status === 'givenUp' && whichPlayer === 1)) {
        console.log('1 OP GAVE UP OK');
        setCentralText('Your opponent gave up!');
        setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false, status: 'giveUp' });
      } else {
        console.log('1 YOU GAVE UP OK');
        setCentralText('You gave up :(');
        setGame({ ...game, isEnded: true, isPlaying: false, status: 'giveUp' });
      }
    }
    else if (gameStatePlay?.gameStatus === 'ended') {
      setIsPlayerReady(true);
      if ((gameStatePlay.gameParams.pl1.isWinner === true && whichPlayer === 1)
        || (gameStatePlay.gameParams.pl2.isWinner === true && whichPlayer === 2)) {
        console.log('Here ended 1');
        setCentralText('You win!!');
        setGame({ ...game, isUserWinner: true, isEnded: true, isPlaying: false });
      } else {
        console.log('Here ended 2');
        setCentralText('You lose...');
        setGame({ ...game, isEnded: true, isPlaying: false, isUserWinner: false });
      }
    }
    else if (gameStatePlay) {
      game.ball.updateBall(game.board, gameStatePlay.gameParams.ball);
      game.pl1.updatePlayer(game.board, gameStatePlay.gameParams.pl1);
      game.pl2.updatePlayer(game.board, gameStatePlay.gameParams.pl2);
    }
  }, [gameStatePlay]);

  // Prepare useEffect
  useEffect(() => {
    // console.log('Prepare:', gameStatePrepare);
    if (gameStatePlay?.gameStatus === 'ended'
      || gameStatePlay?.gameStatus === 'giveUp') return;
    if (game.status === 'noGame')
      console.log('thhhhhhhhhhhhhhhhhhhhhhhhhis')
    if (gameStatePrepare?.gameStatus) setGame({ ...game, status: gameStatePrepare?.gameStatus });
    if (gameStatePrepare?.gameStatus === 'pending'
      || (gameStatePrepare?.gameStatus === 'waiting' && gameStatePrepare.playerStatus === 'pending')
      || (gameStatePrepare?.playerStatus === 'pending' && gameStatePrepare.gameStatus !== 'timeout')) {
      console.log('1 P READY');
      setCentralText('Ready?');
    } else if (gameStatePrepare?.gameStatus === 'waiting'
      && gameStatePrepare.playerStatus === 'ready'
      && gameStatePrepare.opponentStatus === 'pending') {
      console.log('1 P WAITING');
      setIsPlayerReady(true);
      setCentralText('Waiting for opponent');
    } else if (gameStatePrepare?.gameStatus === 'countdown') {
      console.log('1 P COUNTDOWN');
      setIsOpponentReady(true);
      setIsPlayerReady(true);
      if (gameStatePrepare.countdown) {
        setCentralText(gameStatePrepare.countdown);
      } else
        setCentralText('Get ready!');
    } else if (gameStatePrepare?.gameStatus === 'timeout') {
      console.log('1 P TIMEOUT');
      setCentralText('Timeout - game canceled')
      setTimeout(() => {
        console.log('thhhhhhhhhhhhhhhhhhhhhhhhhaaaaaaaaaaaaaaaaaaaats')
        history(APP_ROUTES.MATCHMAKING_ABSOLUTE);
      }, 3 * 1000);
    } else if (gameStatePrepare?.gameStatus === 'playing') {
      console.log('1 P ELSE');
      if (socket.game) socket.game.off('prepareToPlay');
      setGame({ ...game, isPlaying: true });
    }
  }, [gameStatePrepare, game.status]);

  // Window resizing
  useEffect(() => {
    const handleResize = () => {
      // Adapter la largeur ici a celle de lecran total vs le conteneur
      const newWidth = window.innerWidth * 0.4;
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

      <ProfilesHeader game={game} player1Data={player1Data} player2Data={player2Data} />

      <ScoreBoard game={game} />

      <AllCanvas game={game} socket={socket.game} whichPlayer={whichPlayer} centralText={centralText}
        isPlayerReady={isPlayerReady} profileCardHeight={profileCardHeight} />

      <GiveUp socket={socket.game} whichPlayer={whichPlayer} game={game} gameStatus={game.status} />

      <NoGame />

    </div >
  );

};

export default Play;
