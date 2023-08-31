import { useEffect, useState } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import { useWebsocketContext } from 'services/Websocket/Websocket';
import { UserArray } from "services/User/UserArray";
import { UserData } from "services/User/User";
import { createGlobalStyle } from 'styled-components';
import AllUsersList from './Components/AllUsersList';

const AllUsers = () => {
  const [usersData, setUsersData] = useState<any>({});
  const [usersList, setUsersList] = useState<any[]>([]);
  const socket = useWebsocketContext();

    // Sockets on
    useEffect(() => {
      socket.general?.on('allUsers', (data: any) => {
        setUsersData(data);
      });
      socket.general?.emit('allUsers', { action: 'status' });
      return () => {
        socket.general?.off('allUsers');
      };
    }, [socket.general]);

    useEffect(() => {
      const tmpUsersList = (Object.entries(usersData) as Array<[string, UserData]>).map(
        ([userId, userData]: [string, UserData]) => ({
          profilePicture: userData.profilePicture,
          username: userData.username,
          isOnline: userData.isOnline,
          isPlaying: userData.isPlaying,
        }));
        setUsersList(tmpUsersList);
    })

  return (
    <main className="right-screen-container">
      <article className="friends-main-container" style={{}}>

        <header className="friends-header">
          All users
        </header>

        <MDBContainer className="friends-container">
          <AllUsersList usersList={usersList} />
        </MDBContainer>

      </article>
    </main>
  );


}

export default AllUsers;