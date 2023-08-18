import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import User from "../../../Services/User";

interface UserProfileProps {
  user: User;
  onRemoveClick: (id: string | undefined) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onRemoveClick }) => {
  return (
    <article className="friends__profile" key={user.getId()}>
      <img
        src={user.getProfilePicture()}
        alt={user.getUsername()}
        className="friends__picture"
      />
      <button className="friends__name" title="Go to user profile" key={user.getId()}>
        {user.getUsername()}
      </button>

      <div className="friends__heart">
        <span title={`${user.getIsOnline() ? 'online' : 'offline'}`}
          className={`border friends__status-circle ${user.getIsOnline() ? 'online' : 'offline'}`}>
          {user.getIsOnline() && <span className="ripple"></span>}
        </span>

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
