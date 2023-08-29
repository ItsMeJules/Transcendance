import React from 'react';
import User from "../../../services/User/User";
import UserProfile from "./UserProfile";

interface UserProfilesListProps {
  users: User[];
  currentUserId?: string | null;
}

const UserProfilesList: React.FC<UserProfilesListProps> = ({ users, currentUserId }) => {
  return (
    <main className="leaderboard__profiles">
      {users.map((user) => (
        <UserProfile
        key={user.getId()}
        user={user}
        currentUserId={currentUserId} />
      ))}
    </main>
  );
};

export default UserProfilesList;
