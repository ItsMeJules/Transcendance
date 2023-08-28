import axios from "axios";
import { useEffect, useState, useContext } from "react";

import User, { UserData } from "../../../Services/User";
import { API_ROUTES } from "../../../Utils";
import PayloadAction from "../models/PayloadSocket";
import { SendDataContext } from "../ChatBox";

type UsersListProps = {
  filter?: (userName: string) => boolean;
};

const UsersList = ({ filter = () => true }: UsersListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  useEffect(() => {
    const fetchAllUsers = async (): Promise<User[]> => {
      const response = await axios.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true });

      const frontUsers: User[] = response.data.reduce(
        (filteredUsers: User[], data: UserData) => {
          const frontUser: User = new User();

          frontUser.setUserFromResponseData(data);
          if (filter(frontUser.getUsername())) filteredUsers.push(frontUser);

          return filteredUsers;
        },
        []
      );

      return frontUsers;
    };

    const fetchData = async () => {
      try {
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchData();
  }, [filter]);

  const handleSubmit = (target: number) => {
    let payload: PayloadAction = { action: "noMatch", targetId: target };
    if (inputValue === "") return;
    switch (inputValue) {
      case "block":
        payload = { ...payload, action: "block" };
        break;
      case "unblock":
        payload = { ...payload, action: "unblock" };
        break;
      case "ban":
        payload = { ...payload, action: "ban" };
        break;
      case "unban":
        payload = { ...payload, action: "unban" };
        break;
      case "promote":
        payload = { ...payload, action: "promote" };
        break;
      case "demote":
        payload = { ...payload, action: "demote" };
        break;
      case "mute":
        payload = { ...payload, action: "mute" };
        break;
      case "unmute":
        payload = { ...payload, action: "unmute" };
        break;
      case "kick":
        payload = { ...payload, action: "kick" };
        break;
      case "invite":
        payload = { ...payload, action: "invite" };
        break;
      default:
    }
    sendData && sendData(payload.action, payload);
    setInputValue("");
    setSelectedUser(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent, target: number) => {
    if (event.key === "Enter") {
      handleSubmit(target);
    }
  };

  return (
    <div className="users-list">
      {users.map((user, key) => (
        <div
          key={key}
          className="user-container"
          onClick={() => setSelectedUser(user.getUsername())}
        >
          <div className="user">
            <img
              className="profile-picture"
              src={user.getProfilePicture()}
              alt="Profile"
              style={{ border: "1px solid " + (user.getIsOnline() ? "lime" : "red") }}
            />
            <p className="username">{user.getUsername()}</p>
          </div>
          {selectedUser === user.getUsername() && (
            <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Entrez du texte ici..."
                onKeyPress={(e) => handleKeyPress(e, Number(user.getId()))} // Gestion de la touche Entrée
              />
              <button onClick={() => handleSubmit(Number(user.getId()))}>Valider</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UsersList;
