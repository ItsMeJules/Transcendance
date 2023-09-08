import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { useState, useEffect } from "react";
import { MDBCardText } from "mdb-react-ui-kit";
import LogoutParent from "layout/LogoutButton/LogoutParent";
import { UserData } from "services/User/User";
import { useWebsocketContext } from "services/Websocket/Websocket";
import getProgressBarClass from "utils/progressBar/ProgressBar";

const ProfileHeader = () => {
  const history = useNavigate();
  const [profilePicture, setProfilePicture] = useState('');  // Set default picture
  const [errMsg, setErrMsg] = useState('');
  const [progressBarClass, setProgressBarClass] = useState('progress-bar-1');
  const [parsedUserLevel, setParsedUserLevel] = useState(1);
  const [winRatio, setWinRatio] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);
  const socket = useWebsocketContext();

  const [userDataSocket, setUserDataSocket] = useState<UserData | null>(null);

  // Socket on
  useEffect(() => {
    socket.game?.on("userDataSocket", (data: any) => {
      setUserDataSocket(data);
    });
    socket.game?.emit("userDataSocket", { action: "query" });
    return () => {
      socket.game?.off("userDataSocket");
    };
  }, [socket.game]);

  useEffect(() => {
    if (!userDataSocket) return;
    if (userDataSocket.profilePicture) setProfilePicture(userDataSocket.profilePicture);
    if (userDataSocket.userLevel) setParsedUserLevel(userDataSocket.userLevel);
    if (
      userDataSocket.gamesPlayed &&
      userDataSocket.gamesWon &&
      userDataSocket.gamesPlayed > 0
    )
      setWinRatio((userDataSocket.gamesWon / userDataSocket.gamesPlayed) * 100);
    setGamesPlayed(userDataSocket.gamesPlayed);
    setProgressBarClass(getProgressBarClass(userDataSocket.userLevel));
  }, [userDataSocket]);

  const handleProfileClick = () => {
    history(APP_ROUTES.USER_PROFILE);
  };

  return (
    <main className="profile-header-container">
      <div className="icons">
        <div className="pic">
          <button className="profile-pic-button" onClick={handleProfileClick}>
            <img className="profile-pic-image" src={profilePicture} alt="" />
          </button>
        </div>
        <div className="WinLossRatio">
          <MDBCardText className="small text-muted mb-0 custom-text-color text-center">
            {gamesPlayed !== null
              ? `Win Rate: ${winRatio.toFixed(2)}%`
              : "No games played yet"}
          </MDBCardText>
        </div>

        <div className="progress-bar-container">
          <div className={`progress-bar ${progressBarClass}`}></div>
          <MDBCardText className="small mt-0.5 text-muted mb-0 custom-text-color text-center">
            Level {parsedUserLevel}
          </MDBCardText>
        </div>

        <LogoutParent setErrMsg={setErrMsg} />
      </div>
    </main>
  );
};

export default ProfileHeader;
