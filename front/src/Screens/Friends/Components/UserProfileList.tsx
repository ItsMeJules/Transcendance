import React from 'react';
import User from "../../../Services/User";
import UserProfile from "./UserProfile";

interface UserProfileListProps {
  users: User[];
  onRemoveClick: (id: string | undefined) => void;
  onProfileClick: (user: User) => void;
}

const UserProfileList: React.FC<UserProfileListProps> = ({ users, onRemoveClick, onProfileClick }) => {
  return (
    <main className="friends__profiles">
      {users.map(user => <UserProfile key={user.getId()} user={user} onRemoveClick={onRemoveClick} onProfileClick={onProfileClick} />)}
    </main>
  );
};

export default UserProfileList;
