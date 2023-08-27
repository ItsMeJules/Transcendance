import { useEffect, useState } from 'react';
import { UserData } from 'services/User/User';
import getParseLocalStorage from 'utils/getParseLocalStorage/getParseLocalStorage';
import { useWebsocketContext } from 'services/Websocket/Websocket';
import PlayBack from './PlayBack';

export const Play = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [player1Data, setPlayer1Data] = useState<UserData | null>(null);
  const [player2Data, setPlayer2Data] = useState<UserData | null>(null);
  const [whichPlayer, setWhichPlayer] = useState(0);
  // const [socketData, setSocketData] = useState('');
  const socket = useWebsocketContext();

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


  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', justifyContent: 'center' }}>
        

        <div className="page-container">
              <PlayBack whichPlayer={whichPlayer}/>
            PLAY
        </div>

        

    </div>
  )
}

export default Play;
