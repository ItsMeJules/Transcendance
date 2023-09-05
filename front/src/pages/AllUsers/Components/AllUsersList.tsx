import React from "react";
import AllUsersInstance from "./AllUsersInstance";


interface AllUsersListProps {
  usersList: any[];
  currentUserId?: string;
}

const AllUsersList: React.FC<AllUsersListProps> = ({ usersList, currentUserId }) => {
  return (
    <main className="allusers__profiles">
      {usersList.map((user) =>
        <AllUsersInstance
        key={user.id}
        user={user}
        currentUserId={currentUserId}/>
      )}
    </main>
  );
}

export default AllUsersList;