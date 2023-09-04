import React from 'react';
import { FaHeart } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import User from "../../../services/User/User";

interface UserProfileProps {
  user: any;
  onProfileClick: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onProfileClick }) => {
  return (
    <main className="friends__profile" key={user.id}>

      <img src={user.profilePicture} alt={user.username}
        className={`friends__picture ${user.isOnline ? 'online' : 'offline'}`}/>

      <button className="friends__name" title="Go to user profile" key={user.id} onClick={() => onProfileClick(user)} >
        {user.username}
      </button>

      {user.isPlaying &&
        <section title='Playing'>
          <img src="/images/playing.png" alt=""
            className="friends__isplaying" />
        </section>}

      {!user.isPlaying &&
        <div></div>}

      <button className="friends__heart">
        <IconContext.Provider value={{ color: 'red', size: '30px' }}>
          <FaHeart />
        </IconContext.Provider>
      </button>

    </main>
  );
};

export default UserProfile;
