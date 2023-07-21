import React, { useEffect, useState } from "react"
import axios from "../api/axios";
import { HttpStatusCode } from "axios";

const LEADERBOARD_URL = '/users/all';

const myStyle={
    backgroundImage:
    "url('../images/bg4.jpg')",
    height: '100vh',
    // width: 'w-screen',
    marginTop:'-70px',
    marginBottom: '-70px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};

// HttpStatusCode
export const Leaderboard = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch user data from the backend API
        const fetchUsers = async () => {
          try {
            const response = await axios.get(LEADERBOARD_URL);
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        fetchUsers();
      }, []);

      return (
        <div className="page-container">
          <h1>Leaderboard</h1>
          {/* {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading users...</p>
          )} */}
        </div>
      );
}