import { useWebsocketContext } from "services/Websocket/Websocket";
import { useState } from "react";
import User from "services/User/User";
import AllUsersInstance from "./AllUsersInstance";

interface AllUsersListProps {
  usersList: any[];
}

const AllUsersList: React.FC<AllUsersListProps> = ({ usersList }) => {
  const [userData, setUserData] = useState<any | null>(null);
  const socket = useWebsocketContext();

  return (
    <main className="allusers__profiles">
      {usersList.map((user) =>
        <AllUsersInstance key={user.id} user={user} />
      )}
    </main>
  );
}

export default AllUsersList;