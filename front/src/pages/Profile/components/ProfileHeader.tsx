import React from 'react';
import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { IconContext } from 'react-icons';
import { FaHeart } from 'react-icons/fa6';
import { FaLeftLong } from 'react-icons/fa6';
import { FaUserPen } from 'react-icons/fa6';

type ProfileType = 'user' | 'generic' | 'edit';

type ProfileHeaderProps = {
  setErrMsg: (message: string) => void;
  type: ProfileType;
  iconColor?: string;
  onAddFriend?: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ setErrMsg, type, iconColor, onAddFriend }) => {
  return (
    <div className="profile-board-header">
      {type === 'user' && (
        <Link className="icon" title="Edit profile" to={APP_ROUTES.USER_PROFILE_EDIT_ABSOLUTE} style={{ padding: '0px' }}>
          <IconContext.Provider value={{ color: iconColor || 'rgba(255, 255, 255, 0.5)', size: '36px' }}>
            <FaUserPen />
          </IconContext.Provider>
        </Link>
      )}

      {type === 'generic' && (
        <button onClick={onAddFriend}>
          <IconContext.Provider value={{ color: iconColor || 'rgba(255, 255, 255, 0.7)', size: '30px' }}>
            <FaHeart />
          </IconContext.Provider>
        </button>
      )}

      {type === 'edit' && (
        <Link className="icon" title="Back to profile" to={APP_ROUTES.USER_PROFILE_ABSOLUTE} style={{ padding: '0px' }}>
          <IconContext.Provider value={{ color: iconColor || 'rgba(255, 255, 255, 0.5)', size: '30px' }}>
            <FaLeftLong />
          </IconContext.Provider>
        </Link>
      )}

    </div>
  );
};

export default ProfileHeader;
