import React from 'react';
import User from "../../../Services/User";
import UserProfile from "./UserProfile";

interface UserProfileListProps {
  users: User[];
  onRemoveClick: (id: string | undefined) => void;
}

const UserProfileList: React.FC<UserProfileListProps> = ({ users, onRemoveClick }) => {
  return (
    <main className="friends__profiles">
      {users.map(user => <UserProfile key={user.getId()} user={user} onRemoveClick={onRemoveClick} />)}
    </main>
  );
};

export default UserProfileList;
