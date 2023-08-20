import React, { useEffect, useState } from "react";
import { AxiosInstance } from "axios";


import Popup from "../Popup"
import User from "../../../../../Services/User";
import { useAxios } from "../../../../../api/axios-config";
import UsersList, { fetchAllUsers } from "../../UsersList";

export default function DirectMessagePopup() {
  const axiosInstance: AxiosInstance = useAxios() // Can't be used inside a callback function, why?
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await fetchAllUsers(axiosInstance);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Popup className="dm-popup">
      <div className="users-list">
        <UsersList users={users} />
      </div>
    </Popup>
  )
}
