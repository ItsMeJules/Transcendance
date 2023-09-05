import { useEffect, useState } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import { useWebsocketContext } from 'services/Websocket/Websocket';
import { UserData } from "services/User/User";

import AllUsersList from './Components/AllUsersList';
import './css/AllUsers.scss'

const AllUsers = () => {
  const [userId, setUserId] = useState<string>();
  const [usersData, setUsersData] = useState<any>({});
  const [usersList, setUsersList] = useState<any[]>([]);
  const socket = useWebsocketContext();

  // Socket on + emit
  useEffect(() => {
    socket.game?.on('allUsers', (data: any) => {
      console.log('ALL USERS data:', data);
      setUserId(data.userId);
      setUsersData(data.allUsers);
    });
    socket.game?.emit('allUsers', { action: 'status' });
    return () => {
      socket.game?.off('allUsers');
    };
  }, [socket.game]);

  // Set data
  useEffect(() => {
    const tmpUsersList = (Object.entries(usersData) as Array<[string, UserData]>).map(
      ([userId, userData]: [string, UserData]) => ({
        id: userData.id,
        profilePicture: userData.profilePicture,
        username: userData.username,
        isOnline: userData.isOnline,
        isPlaying: userData.isPlaying,
      }));
    setUsersList(tmpUsersList);
  }, [usersData])

  return (
    <article className="all-users-main-container">

      <header className="all-users-header">
        All users
      </header>

      <MDBContainer className="allusers-container">
        <AllUsersList usersList={usersList} currentUserId={userId}/>
      </MDBContainer>

    </article>
  );
}

export default AllUsers;