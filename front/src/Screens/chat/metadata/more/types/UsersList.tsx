import React from "react";
import { AxiosInstance, AxiosResponse } from "axios";

import User, { UserData } from "../../../../../Services/User";
import { API_ROUTES } from "../../../../../Utils";

interface UserListProps {
  users: User[];
}

export const fetchAllUsers = async (axiosInstance: AxiosInstance): Promise<User[]> => {
  console.log("getting all users...")
  const response: AxiosResponse<any, any> = await axiosInstance.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true })

  console.log("treating response data...")
  const frontUsers: User[] = response.data.map((data: UserData) => {
    const frontUser: User = new User(); 

    frontUser.setUserFromResponseData(data);
    
    return frontUser;
  });

  return frontUsers;
}

const UsersList: React.FC<UserListProps> = ({ users }) => {
  return (
    <>
      {users.map((user, key) => ( //key is mandatory.
        <div className="user-container">
          <div key={key} className="user">
            <img className="profile-picture" src={user.getProfilePicture()} alt="Profile picture"
              style={{ border: "1px solid " + (user.getIsOnline() ? "lime" : "red") }} />
            <p className="username">{user.getUsername()}</p>
          </div>
        </div>
      ))}
    </>
  )
}

export default UsersList;