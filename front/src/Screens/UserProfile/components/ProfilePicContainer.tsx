import React, { } from 'react';
import { UserData } from '../../../Services/user';

interface ProfilePicContainerProps {
  userData: UserData | null;
}

const ProfilePicContainer: React.FC<ProfilePicContainerProps> = ({ userData }) => {

  return (
    <div className="profile-pic-container">
      {userData?.profilePicture ? (
        <div className="profile-pic-circle">
          <img src={userData.profilePicture} alt="" />
        </div>
      ) : (
        <div className="empty-profile-picture-container">
          <span style={{ fontSize: '1rem' }}>No profile picture</span>
        </div>
      )}
    </div>
  )
}

export default ProfilePicContainer;