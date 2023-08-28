import axios from "axios";
import { useEffect, useState } from "react";
import User, { UserData } from "../../../../../Services/User";
import { API_ROUTES } from "../../../../../Utils";
import Popup from "../../../utils/Popup";
import UsersList from "../../../utils/UsersList";

export default function AllUsers() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true })

        const frontUsers: User[] = response.data.reduce((frontUsers: User[], data: UserData) => {
          const frontUser: User = new User();

          frontUser.setUserFromResponseData(data);
          frontUsers.push(frontUser);

          return frontUsers;
        }, []);

        setUsers(frontUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    }

    fetchAllUsers()
  }, []);

  return (
    <Popup className="all-users-popup">
      <input
        className="filter-users"
        type="search"
        placeholder="Chercher un utilisateur"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    <UsersList users={users} filter={(userName: string) => userName.includes(searchText)}/>
    </Popup>
  );
}
