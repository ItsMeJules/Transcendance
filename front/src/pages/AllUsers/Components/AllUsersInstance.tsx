import React from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import User from "../../../services/User/User";

interface AllUsersInstanceProps {
  user: any;
  currentUserId?: string;
}

const AllUsersInstance: React.FC<AllUsersInstanceProps> = ({ user, currentUserId }) => {
  const history = useNavigate();

  const handleProfileClick = (user: User) => {
    if (user.id === currentUserId) history(APP_ROUTES.USER_PROFILE);
    else history(APP_ROUTES.GENERIC_USER_PROFILE + user.id);
  };

  return (
    <main className="allusers__profile" key={user.id}>
      <img
        src={user.profilePicture}
        alt={user.username}
        className={`allusers__picture ${user.isOnline ? "online" : "offline"}`}
        title={`${user.isOnline ? "online" : "offline"}`}
      />

      <button
        className="allusers__name"
        title="Go to user profile"
        key={user.id}
        onClick={() => handleProfileClick(user)}
      >
        {user.username}
      </button>

      {user.isPlaying && (
        // WATCH GAME MAKE HERE
        <button title="Playing">
          <img src="/images/playing.png" alt="" className="allusers__isplaying" />
        </button>
      )}
    </main>
  );
};

export default AllUsersInstance;
