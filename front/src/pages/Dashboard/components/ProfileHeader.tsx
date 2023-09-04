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
  const [winLossRatio, setWinLossRatio] = useState<number | null>(null);

  const updateStateFromLocalStorage = () => {
    console.log('updateStateFromLocalStorage called');
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
      if (parsedUserData.gamesPlayed > 0) {
        const winPercentage = (parsedUserData.gamesWon / parsedUserData.gamesPlayed) * 100;
        setWinLossRatio(winPercentage);
      } else {
        setWinLossRatio(null);
      }
    }
  };

  useEffect(() => {
    updateStateFromLocalStorage();

    const handleStorageChange = (e: StorageEvent) => {
      console.log('handleStorageChange called', e);
      if (e.key === 'userData') {
        updateStateFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
        <MDBCardText className="small text-muted mb-0 custom-text-color text-center">
            {winLossRatio !== null ? `Win Rate: ${winLossRatio.toFixed(2)}%` : "No games played yet"}
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