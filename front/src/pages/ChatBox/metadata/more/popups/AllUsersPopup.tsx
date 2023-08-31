import axios from "axios";
import { useEffect, useState } from "react";
import User, { UserData } from "services/User/User";
import { API_ROUTES } from "utils/routing/routing";
import Popup from "../../../utils/Popup";
import UsersList from "../../../utils/UsersList";
import UserActionPopup from "../../../utils/UserActionPopup";

export default function AllUsers() {
  const [searchText, setSearchText] = useState("");
  const [userClicked, setUserClicked] = useState<User | null>(null)
  const users = useAllUsers()

  return (
    <Popup className="all-users-popup">
      <input
        className="filter-users"
        type="search"
        placeholder="Chercher un utilisateur"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <UsersList
        users={users}
        filter={(userName) => userName.toLowerCase().includes(searchText.toLowerCase())}
        onUserClick={({ user }) => setUserClicked(user)}
      />
      {userClicked !== null
        ? <UserActionPopup
          user={userClicked}
          buttonClicked={0}
        />
        : undefined}
    </Popup>
  );
}

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true });
    const frontUsers = response.data.map((data: UserData) => {
      const frontUser = new User();

      frontUser.setUserFromResponseData(data);

      return frontUser;
    });

    return frontUsers
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return []
  }
};

export function useAllUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      setUsers(await fetchAllUsers())
    }
    getUsers()
  }, []);

  return users;
}
