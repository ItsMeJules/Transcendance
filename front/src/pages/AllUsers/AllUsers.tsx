import { useEffect, useState } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import { useWebsocketContext } from 'services/Websocket/Websocket';
import { UserData } from "services/User/User";
import AllUsersList from './Components/AllUsersList';
import './css/AllUsers.scss'

const AllUsers = () => {
  const [usersData, setUsersData] = useState<any>({});
  const [usersList, setUsersList] = useState<any[]>([]);
  const socket = useWebsocketContext();

  // Sockets on
  useEffect(() => {
    socket.game?.on('allUsers', (data: any) => {
      console.log('ALL USERSSSSSSSSSSSSS:', data);
      setUsersData(data);
    });
    socket.game?.emit('allUsers', { action: 'status' });
    return () => {
      socket.game?.off('allUsers');
    };
  }, [socket.game]);

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
    <main className="right-screen-container">
      <article className="all-users-main-container">

        <header className="all-users-header">
          All users
        </header>

        <MDBContainer className="allusers-container">
          <AllUsersList usersList={usersList} />
        </MDBContainer>

      </article>
    </main>
  );
}

export default AllUsers;