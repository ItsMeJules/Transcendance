import { useNavigate } from "react-router-dom";
import { APP_ROUTES, APP_SCREENS } from "utils/routing/routing";
import React, { useState, useEffect } from 'react';

const ProfileHeader = () => {
  const history = useNavigate();
  const [profilePicture, setProfilePicture] = useState('/images/game.png');  // Set default picture
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData.profilePicture) {
        setProfilePicture(parsedUserData.profilePicture);
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

        <div className="stats">

        </div>
        <div className="icons">
          <LogoutParent setErrMsg={setErrMsg} />
        </div>
      </div>

    </main>
  );
};

export default ProfileHeader
