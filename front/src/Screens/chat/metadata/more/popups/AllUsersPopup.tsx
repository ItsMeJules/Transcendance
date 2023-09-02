import axios from "axios";
import { useEffect, useState } from "react";
import User, { UserData } from "../../../../../Services/User";
import { API_ROUTES } from "../../../../../Utils";
import Popup from "../../../utils/Popup";
import UsersList from "../../../utils/users/UsersList";
import UserActionPopup from "../../../utils/users/UserActionPopup";
import { useAppSelector } from "../../../../../redux/Store";

export default function AllUsers() {
  const [searchText, setSearchText] = useState("");
  const [userDataClicked, setUserDataClicked] = useState<UserData | null>(null)
  const { username: activeUserName } = useAppSelector(store => store.user.userData)
  const users = useAllUsers()

  const filter = (userName: string) => {
    return activeUserName !== userName
      && userName.toLowerCase().includes(searchText.toLowerCase())
  }

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
        filter={filter}
        onUserClick={({ userData }) => setUserDataClicked(userData)}
      />
      {userDataClicked !== null
        ?
        <UserActionPopup
          userData={userDataClicked}
          buttonClicked={0}
          channelInvite={true}
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