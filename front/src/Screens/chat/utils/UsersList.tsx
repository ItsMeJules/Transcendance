import React, { useEffect, useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

import User, { UserData } from "../../../Services/User";
import { API_ROUTES } from "../../../Utils";

type UsersListProps = {
  filter?: (userName: string) => boolean;
}

const UsersList = ({ filter = () => true} : UsersListProps) => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchAllUsers = async (): Promise<User[]> => {
      const response = await axios.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true })
    
      const frontUsers: User[] = response.data.reduce((filteredUsers: User[], data: UserData) => {
        const frontUser: User = new User();
        
        frontUser.setUserFromResponseData(data);
        if (filter(frontUser.getUsername()))
          filteredUsers.push(frontUser);

        return filteredUsers;
      }, []);

      return frontUsers;
    }
    
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

  return (
    <div className="users-list">
      {users.map((user, key) => ( //key is mandatory.
        <div className="user-container">
          <div key={key} className="user">
            <img className="profile-picture" src={user.getProfilePicture()} alt="Profile"
              style={{ border: "1px solid " + (user.getIsOnline() ? "lime" : "red") }} />
            <p className="username">{user.getUsername()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UsersList;