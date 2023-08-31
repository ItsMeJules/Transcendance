import { Link, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useEffect, useState } from "react";
// import OnlineGameInstance from "./OnlineGameInstance";

interface AllUsersListProps {
  usersList: any[];
}

const AllUsersList: React.FC<AllUsersListProps> = ({ usersList }) => {
  const [userData, setUserData] = useState<any | null>(null);
  const socket = useWebsocketContext();
  const history = useNavigate();

  return (
    <main className="all-users-list">
      {usersList.map((user) =>
        <AllUsersInstance
          key={user.userId}
          user={user} />
      )}
    </main>
  );
}

export default AllUsersList;