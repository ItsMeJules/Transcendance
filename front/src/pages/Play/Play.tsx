import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfilePicContainer from '../Profile/components/ProfilePicContainer';
import { UserData } from '../../services/User/User';
import { MDBContainer, MDBCard, MDBCardImage } from 'mdb-react-ui-kit';
import getParseLocalStorage from '../../utils/getParseLocalStorage';
import GameBoard from '../../minigame/components/GameBoard';
import { useWebsocketContext } from '../../services/Websocket';
import PlayBack from './PlayBack';

export const Play = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [player1Data, setPlayer1Data] = useState<UserData | null>(null);
  const [player2Data, setPlayer2Data] = useState<UserData | null>(null);
  const [whichPlayer, setWhichPlayer] = useState(0);
  const [socketData, setSocketData] = useState('');
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

    // if (userData.id === player1Data.id)
    //     setOpponentData(player2Data);
    // else
    //     setO
    // if (userDataString) {
    //     userDataJSON = JSON.parse(userDataString);
    //     setUserData(userDataJSON);
    // }


  }, []);


  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', justifyContent: 'center' }}>
        {/* <MDBCard className="profile-game-card">
          <div className="profile-info">
            
            {player1Data?.profilePicture ? (
              <div className="profile-picture-l">
                <img src={player1Data?.profilePicture} alt="User Profile" />
              </div>
            ) : (
              <div>empty</div>
            )}
          </div>
          <div className="profile-name">{player1Data?.username}</div>
        </MDBCard>

        <MDBCard className="profile-game-card">
          VS
        </MDBCard>

        <MDBCard className="profile-game-card">
          <div className="profile-info">
            <div className="profile-name">{player2Data?.username}</div>
            {player2Data?.profilePicture ? (
              <div className="profile-picture-r">
                <img src={player2Data?.profilePicture} alt="User Profile" />
              </div>
            ) : (
              <div>empty</div>
            )}
          </div>
        </MDBCard> */}

        <div className="page-container">
              <PlayBack whichPlayer={whichPlayer}/>
            {/* <GameBoard whichPlayer={whichPlayer}/> */}
            PLAY
        </div>

        

    </div>
  )
}
