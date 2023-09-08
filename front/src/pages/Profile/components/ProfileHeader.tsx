import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { IconContext } from 'react-icons';
import { FaHeart, FaLeftLong, FaTimeline, FaUserPen, FaUserLock } from 'react-icons/fa6';
import { UserData } from "services/User/User";

type ProfileType = 'user' | 'generic' | 'edit';

type ProfileHeaderProps = {
  userData: UserData | null;
  type: ProfileType;
  isFriend?: boolean;
  onAddFriend?: () => void;
  blockUser?: () => void;
  isBlocked?: boolean;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, type, onAddFriend, isFriend, blockUser, isBlocked}) => {

  const [userId, setUserId] = useState<string>();
  useEffect(() => {
    if (userData && userData.id)
      setUserId(userData.id);
  }, [userData]);

  return (
    <>
      <div className="profile-board-header">

        {type === 'user' && (
          <>
            <Link className="icon" title="Edit profile" to={APP_ROUTES.USER_PROFILE_EDIT_ABSOLUTE} style={{ padding: '0px' }}>
              <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.5)', size: '36px' }}>
                <FaUserPen />
              </IconContext.Provider>
            </Link>

            <Link className="icon" title="Game history"
            to={APP_ROUTES.GENERIC_USER_PROFILE_ABSOLUTE + userId + APP_ROUTES.GAME_HISTORY_SUFFIX} style={{ padding: '0px' }}>
              <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.5)', size: '36px' }}>
                <FaTimeline />
              </IconContext.Provider>
            </Link>
          </>
        )}

      {type === 'generic' && (
        <>

          <button onClick={onAddFriend}>
            <IconContext.Provider value={{ color: isFriend ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.5)', size: '30px' }}>
              <FaHeart />
            </IconContext.Provider>
          </button>

          <button onClick={blockUser}>
<IconContext.Provider value={{ color: isBlocked ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.5)', size: '30px' }}>
              <FaUserLock />
            </IconContext.Provider>
          </button>

          <Link className="icon" title="Game history" to={APP_ROUTES.GENERIC_USER_PROFILE_ABSOLUTE + userId + APP_ROUTES.GAME_HISTORY_SUFFIX} style={{ padding: '0px' }}>
              <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.5)', size: '36px' }}>
                <FaTimeline />
              </IconContext.Provider>
          </Link>
          
        </>
      )}

        {type === 'edit' && (
          <Link className="icon" title="Back to profile" to={APP_ROUTES.USER_PROFILE_ABSOLUTE} style={{ padding: '0px' }}>
            <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.5)', size: '30px' }}>
              <FaLeftLong />
            </IconContext.Provider>
          </Link>
        )}

      </div>
    </>
  );
};

export default ProfileHeader;
