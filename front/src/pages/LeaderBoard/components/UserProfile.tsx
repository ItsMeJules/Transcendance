import React from 'react';
import { Link } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import User from "services/User/User";

interface UserProfileProps {
  user: User;
  currentUserId?: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUserId }) => {
  return (
    <Link 
      title="Show user profile"
      style={{ textDecoration: 'none' }}
      to={currentUserId === user.getId() ? APP_ROUTES.USER_PROFILE : APP_ROUTES.GENERIC_USER_PROFILE + user.getId()}
      key={user.getId()}
    >
      <article className="leaderboard__profile">
        <img
          src={user.getProfilePicture()}
          alt={user.getUsername()}
          className="leaderboard__picture"
        />
        <span className="leaderboard__name">{user.getUsername()}</span>
        <span className="leaderboard__value">{user.getUserPoints()}</span>
      </article>
    </Link>
  );
};

export default UserProfile;
