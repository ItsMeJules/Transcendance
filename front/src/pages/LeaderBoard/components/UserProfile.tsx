import React from 'react';
import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import User from "services/User/User";

interface UserProfileProps {
  user: any;
  currentUserId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUserId }) => {
  return (
    <Link
      title="Show user profile"
      style={{ textDecoration: 'none' }}
      to={currentUserId === user.id ? APP_ROUTES.USER_PROFILE : APP_ROUTES.GENERIC_USER_PROFILE + user.id}
      key={user.id}>

      <article className="leaderboard__profile">
        <img
          src={user.profilePicture}
          alt={user.username}
          className={`leaderboard__picture ${user.isOnline ? 'online' : 'offline'}`} />

        <section className="leaderboard__name">{user.username}</section>

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

      </article>
    </Link>
  );
};

export default UserProfile;
