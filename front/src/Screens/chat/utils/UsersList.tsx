import React, { useEffect, useState } from "react";
import { AxiosInstance, AxiosResponse } from "axios";

import User, { UserData } from "../../../Services/User";
import { API_ROUTES } from "../../../Utils";
import { useAxios } from "../../../api/axios-config";

const UsersList = () => {
  const axiosInstance: AxiosInstance = useAxios() // Can't be used inside a callback function, why?
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchAllUsers = async (axiosInstance: AxiosInstance): Promise<User[]> => {
      const response: AxiosResponse<any, any> = await axiosInstance.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true })
    
      const frontUsers: User[] = response.data.map((data: UserData) => {
        const frontUser: User = new User();
    
        frontUser.setUserFromResponseData(data);
    
        return frontUser;
      });
    
      return frontUsers;
    }
    
    const fetchData = async () => {
      try {
        const fetchedUsers = await fetchAllUsers(axiosInstance);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchData();
  }, [axiosInstance]);

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