import React from 'react';
import User from "../../../services/User/User";
import UserProfile from "./UserProfile";

interface UserProfileListProps {
  friendsList: any[];
  onProfileClick: (user: User) => void;
}

const UserProfileList: React.FC<UserProfileListProps> = ({ friendsList, onProfileClick }) => {
  return (
    <main className="friends__profiles">
      {friendsList.map(user =>
        <UserProfile key={user.id} user={user}
          onProfileClick={onProfileClick} />)}
    </main>
  );
};

export default UserProfileList;
