import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";
import React, { useState, useEffect } from 'react';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MDBCardText } from 'mdb-react-ui-kit';
import ProgressBar from "utils/progressBar/ProgressBar";
import LogoutParent from "layout/LogoutButton/LogoutParent";

const ProfileHeader = () => {
  const history = useNavigate();
  const [profilePicture, setProfilePicture] = useState('/images/game.png');  // Set default picture
  const [errMsg, setErrMsg] = useState('');
  const [progressBarClass, setProgressBarClass] = useState('progress-bar-1');
  const [parsedUserLevel, setParsedUserLevel] = useState(1);
  const [winLossRatio, setWinLossRatio] = useState(0);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData.profilePicture) {
        setProfilePicture(parsedUserData.profilePicture);
      }
      if (parsedUserData.userLevel) {
        setParsedUserLevel(parsedUserData.userLevel);
      }
      if (parsedUserData.userLevel) {
        setProgressBarClass(ProgressBar(parsedUserData.userLevel));
      }
      if (parsedUserData.gamesPlayed && parsedUserData.gamesWon) {
        setWinLossRatio((parsedUserData.gamesWon) / (parsedUserData.gamesPlayed - parsedUserData.gamesWon));
      }
    }
  }, []);

  const handleProfileClick = (() => {
    history(APP_ROUTES.USER_PROFILE)
  });

  return (
    <main className="profile-header-container">

      <div className="icons">
        <div className="pic">
          <button className="profile-pic-button" onClick={handleProfileClick}>
            <img className="profile-pic-image" src={profilePicture} alt="Profile" />
          </button>
        </div>
        <div className="WinLossRatio">
          <MDBCardText className="small text-muted mb-0 custom-text-color">
            Win/Loss Ratio: {winLossRatio.toFixed(2)}
          </MDBCardText>
        </div>
        <div className="progress-bar-container">
          <div className={`progress-bar ${progressBarClass}`}></div>
          <MDBCardText className="small mt-0.5 text-muted mb-0 custom-text-color">
            Level {parsedUserLevel}
          </MDBCardText>
        </div>
        <LogoutParent setErrMsg={setErrMsg} />
      </div>

    </main>
  );
};

export default ProfileHeader
