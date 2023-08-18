import React, { useEffect, useState } from "react";
import { AxiosInstance, AxiosResponse } from "axios";


import Popup from "../Popup"
import User, { UserData } from "../../../../../Services/User";
import { useAxios } from "../../../../../api/axios-config";
import { API_ROUTES } from "../../../../../Utils";

interface UserListProps {
  users: User[];
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

export default function DirectMessagePopup() {
  // Can't be used inside a callback function, why?
  const useAxiosInstance: AxiosInstance = useAxios()
  const [users, setUsers] = useState<User[]>([])

  const fetchAllUsers = async () => {
    console.log("getting all users...")
    const response = await useAxiosInstance.get(API_ROUTES.GET_ALL_USERS, { withCredentials: true })

    console.log("treating response data...")
    let frontUsers: User[] = [];

    response.data.forEach((data: UserData) => {
      let frontUser = new User()

      frontUser.setUserFromResponseData(data)
      frontUsers.push(frontUser)
    })

    setUsers(frontUsers)
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  console.log("render")

  return (
    <Popup className="dm-popup">
      <div className="users-list">
        <UsersList users={users} />
      </div>
    </Popup>
  )
}
