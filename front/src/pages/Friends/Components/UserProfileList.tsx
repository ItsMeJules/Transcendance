import React from 'react';
import User from "../../../services/User/User";
import UserProfile from "./UserProfile";

interface UserProfileListProps {
  friendsList: any[];
  onRemoveClick: (id: string | undefined) => void;
  onProfileClick: (user: User) => void;
}

const UserProfileList: React.FC<UserProfileListProps> = ({ friendsList, onRemoveClick, onProfileClick }) => {
  return (
    <main className="friends__profiles">
      {friendsList.map(user =>
        <UserProfile key={user.id} user={user}
          onRemoveClick={onRemoveClick}
          onProfileClick={onProfileClick} />)}
    </main>
  );
};

export default UserProfileList;
