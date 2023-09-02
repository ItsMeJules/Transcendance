import React from "react";
import { useEffect, useState } from "react";
import { UserData } from "services/User/User";
import PlayButton from "./components/PlayButton";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";
import { useWebsocketContext } from "services/Websocket/Websocket";
import './css/JoinGame.scss'
import LoadingAnimation from "./components/LoadingAnimation";

const JoinGame = () => {
  const [socketData, setSocketData] = useState('');
  const [inQueue, setInQueue] = useState(0);
  const [errMsg, setErrMsg] = useState('');
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
        console.log("OKKKKKKKKKKK GOOOODDDDD");
        // setLeftContent(APP_SCREENS.PLAY);
        history(APP_ROUTES.PLAY_ABSOLUTE);
      }
    }
  }, [socketData]);

  useEffect(() => {
    socket.game?.on('joinGameQueue', (data: any) => {
      setSocketData(data);
    });
    socket.game?.emit('joinGameQueue', { gameMode: 'query' });
    return () => {
      socket.game?.off('joinGameQueue');
    };
  }, [socket.game]);


  return (
    <main className="join-game-main-container">

      <header className="join-game-header-title">
        Choose your mode LOL
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