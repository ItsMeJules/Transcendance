import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";
import React, { useState, useEffect } from 'react';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MDBCardText } from 'mdb-react-ui-kit';
import ProgressBar from "utils/progressBar/ProgressBar";
import LogoutParent from "layout/LogoutButton/LogoutParent";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { UserData } from "services/User/User";

const ProfileHeader = () => {
  const [userDataString, setUserDataString] = useState<string | null>(null);
  const [userDataHeader, setUserDataHeader] = useState<UserData | null>(null);
  const history = useNavigate();
  const [profilePicture, setProfilePicture] = useState('/images/game.png');  // Set default picture
  const [errMsg, setErrMsg] = useState('');
  const [progressBarClass, setProgressBarClass] = useState('progress-bar-1');
  const [parsedUserLevel, setParsedUserLevel] = useState(1);
  const [winRatio, setWinRatio] = useState(0);
  const axiosInstanceError = useAxios();
  const [loaded, setLoaded] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstanceError.get(
          "http://localhost:8000/api/users/complete-user",
          {
            withCredentials: true,
          }
        );
        const responseData = response.data;
        localStorage.setItem("userData", JSON.stringify(responseData));
        setFetchedData(responseData);
      } catch (err: any) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
          setErrMsg('Bad request');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
          history(APP_ROUTES.HOME);
        }
        else {
          setErrMsg('Error');
        }
      }
    };
    if (localStorage.getItem('userData') === null)
      fetchUserProfile();
  }, []);

  useEffect(() => {
    const parseLogic = (data: any) => {
      if (data.profilePicture)
        setProfilePicture(data.profilePicture);
      if (data.userLevel)
        setParsedUserLevel(data.userLevel);
      if (data.gamesPlayed && data.gamesWon)
        setWinRatio((data.gamesWon / data.gamesPlayed) * 100);
    };

    const parseValues = () => {
      const localStorageData = localStorage.getItem('userData');
      if (localStorageData) {
        const parsedUserData = JSON.parse(localStorageData);
        parseLogic(parsedUserData);
      }
      else if (fetchedData) {
        parseLogic(fetchedData);
      }
    };

    parseValues();
  }, [fetchedData, localStorage.getItem('userData')]);

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
            Win/Loss Ratio: {winRatio.toFixed(2)}
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
