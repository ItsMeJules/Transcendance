import React from 'react';
import { APP_ROUTES } from "utils/routing/routing";
import User from "services/User/User";
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: any;
  currentUserId?: string;
}


const UserProfile: React.FC<UserProfileProps> = ({ user, currentUserId }) => {
  const history = useNavigate();

  const handleProfileClick = (user: User) => {
    if (user.id === currentUserId) {
      history(APP_ROUTES.USER_PROFILE);
    }
    else {
      history(APP_ROUTES.GENERIC_USER_PROFILE + user.id);
    }
  }

  return (
    <main className="leaderboard__profile" key={user.id}>

      <img src={user.profilePicture} alt={user.username}
        className={`leaderboard__picture ${user.isOnline ? 'online' : 'offline'}`}
        title={`${user.isOnline ? 'online' : 'offline'}`} />

      <button className="leaderboard__name"
        title="Go to user profile"
        key={user.id}
        onClick={() => handleProfileClick(user)} >
        {user.username}
      </button>

      <section className="leaderboard__level">
        <span className="leaderboard__level__lvl">
          Lvl.
        </span>
        {Math.round(user.userLevel)}
      </section>

      <section className="leaderboard__value">
        {user.userPoints}
        <span className="leaderboard__value__pts">
          Pts
        </span>
      </section>

    </main>
  );
};

export default UserProfile;
