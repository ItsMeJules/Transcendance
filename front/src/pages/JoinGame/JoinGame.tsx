import { useEffect, useState } from "react";
import PlayButton from "./components/PlayButton";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { useWebsocketContext } from "services/Websocket/Websocket";
import './css/JoinGame.scss'
import LoadingAnimation from "./components/LoadingAnimation";
import { HttpStatus } from "utils/HttpStatus/HttpStatus";

const JoinGame = () => {
  const [socketData, setSocketData] = useState('');
  const [inQueue, setInQueue] = useState(0);
  const socket = useWebsocketContext();
  const history = useNavigate();

  useEffect(() => {
    if (socketData) {
      const dataString = JSON.stringify(socketData);
      const dataJSON = JSON.parse(dataString);
      console.log('Received:', dataJSON);
      if (dataJSON.status === "JOINED")
        setInQueue(dataJSON.gameMode);
      else if (dataJSON.status === "LEAVE")
        setInQueue(0);
      else if (dataJSON.status === 'INGAME')
        history(APP_ROUTES.PLAY_ABSOLUTE);
      else if (dataJSON.status === 'START') {
        localStorage.setItem('gameData', JSON.stringify(dataJSON.game));
        localStorage.setItem('player1', JSON.stringify(dataJSON.player1));
        localStorage.setItem('player2', JSON.stringify(dataJSON.player2));
        localStorage.setItem('gameChannel', JSON.stringify(dataJSON.gameChannel));
        setInQueue(0);
        history(APP_ROUTES.PLAY_ABSOLUTE);
      }
    }
  }, [socketData]);

  useEffect(() => {
    console.log('SOCKET id:', socket.game?.id);
    socket.game?.on('joinGameQueue', (data: any) => {
      console.log('SOCKET ON JOIN RECEIVED:', data);
      setSocketData(data);
    });
    // socket.game?.on('gameError', (data: any) => {
    //   console.log('SOCKET ON JOIN RECEIVED:', data);
    //   if (data.errorStatus === HttpStatus.UNAUTHORIZED)
    //   navigate("/login?error=unauthorized");
    // });
    return () => {
      socket.game?.off('joinGameQueue');
      socket.game?.off('gameError');
    };
  }, [socket.game]);


  return (
    <main className="join-game-main-container">

      <header className="join-game-header-title">
        Choose your mode
      </header>

      <article className="join-game-buttons">
        <PlayButton gameMode={1} inQueue={inQueue} buttonText="Play normal mode" />
        <PlayButton gameMode={2} inQueue={inQueue} buttonText="Play random mode" />
      </article>

      <LoadingAnimation inQueue={inQueue} />


    </main>
  );
}

export default JoinGame;
