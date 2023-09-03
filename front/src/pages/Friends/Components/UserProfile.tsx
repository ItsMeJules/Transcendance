import React from 'react';
import { FaHeart } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import User from "../../../services/User/User";

interface UserProfileProps {
  user: User;
  onRemoveClick: (id: string | undefined) => void;
  onProfileClick: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onRemoveClick, onProfileClick }) => {
  return (
    <article className="friends__profile" key={user.getId()}>
      <img
        src={user.getProfilePicture()}
        alt={user.getUsername()}
        className="friends__picture"
      />
      <button className="friends__name" title="Go to user profile" key={user.getId()} onClick={() => onProfileClick(user)} >
        {user.getUsername()}
      </button>

      <div className="friends__heart">
        <button className="" onClick={() => onRemoveClick(user.getId())}>
          <IconContext.Provider value={{ color: 'red', size: '30px' }}>
            <FaHeart />
          </IconContext.Provider>
        </button>
      </div>
    </article>
  );
};

export default UserProfile;
