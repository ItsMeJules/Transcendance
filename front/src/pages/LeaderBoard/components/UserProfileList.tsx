import React from 'react';
import UserProfile from "./UserProfile";

interface UserProfilesListProps {
  leaderboardList: any[];
  currentUserId?: string;
}

const UserProfilesList: React.FC<UserProfilesListProps> = ({ leaderboardList, currentUserId }) => {
  return (
    <main className="leaderboard__profiles">
      {leaderboardList.map((user) => (
        <UserProfile
        key={user.id}
        user={user}
        currentUserId={currentUserId} />
      ))}
    </main>
  );
};

export default UserProfilesList;
