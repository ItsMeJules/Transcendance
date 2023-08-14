import { useEffect, useState } from "react";
import axios from "axios";
import { connectSocket, disconnectSocket, sendMessage } from "../Websocket/Socket.io";
import { UserData } from "../Services/User";
import PlayButton from "../Components/PlayButton";
import Game, { GameData } from "../Services/Game";
import { useNavigate } from "react-router-dom";

export const Test = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [socketData, setSocketData] = useState('');
  const [inQueue, setInQueue] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const history = useNavigate();

  useEffect(() => {
    if (socketData) {
      const dataString = JSON.stringify(socketData);
      const dataJSON = JSON.parse(dataString);
      if (dataJSON.status === "JOINED")
        setInQueue(true);
      else if (dataJSON.status === "LEAVE")
        setInQueue(false);
      else if (dataJSON.status === 'START') {
        localStorage.setItem('gameData', JSON.stringify(dataJSON.game));
        localStorage.setItem('player1', JSON.stringify(dataJSON.player1));
        localStorage.setItem('player2', JSON.stringify(dataJSON.player2));
        localStorage.setItem('gameChannel', JSON.stringify(dataJSON.gameChannel));
        setInQueue(false);
        history('/play');
      }
    }
  }, [socketData]);

  useEffect(() => {
    console.log('inQueue', inQueue);
  }, []);

  return (
    <div>
      <header className="flex"
        style={{ flexDirection: 'column', zIndex: '1' }}>

        <PlayButton gameMode={4} setSocketData={setSocketData} />

        {inQueue &&
          <div className="loading-container">
            <div className="loading"></div>
            <div id="loading-text"
              className="">
              Waiting for opponent
            </div>
          </div>}

      </header>
    </div>
  )
}