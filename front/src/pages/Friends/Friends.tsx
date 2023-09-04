import { useEffect, useState } from "react";
import axios, { } from "axios";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import ToastError from "layout/ToastError/ToastError";
import ToastMessage from "layout/ToastMessage/ToastMessage";
import { UserArray } from "services/User/UserArray";
import { UserData } from "services/User/User";
import User from "services/User/User";
import { MDBContainer } from 'mdb-react-ui-kit';
import FriendsHeader from "./Components/FriendsHeader";
import UserProfileList from "./Components/UserProfileList";
import FriendsContainer from "./Components/FriendsContainer";
import { useWebsocketContext } from "services/Websocket/Websocket";

import './css/Friends.scss';

const Friends = () => {
  const [friendsData, setFriendsData] = useState<any>({});
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserArray>([]);
  const [removeFlag, setRemoveFlag] = useState(false);
  const history = useNavigate();
  const [notifMsg, setNotifMsg] = useState('');
  const [idToRemove, setIdToRemove] = useState<string | undefined>('none');
  const socket = useWebsocketContext();

  const truRemoveFlag = () => {
    setRemoveFlag(true);
  };

  // Socket on + emit
  useEffect(() => {
    socket.game?.on('friends', (data: any) => {
      console.log('friends received:', data.friends);
      setFriendsData(data.friends);
    });
    socket.game?.emit('friends', { action: 'status' });
    return () => {
      socket.game?.off('friends');
    };
  }, [socket.game]);

  // Set data
  useEffect(() => {
    if (friendsData.length <= 0) {
      setFriendsList([]);
      return;
    }
    const tmpFriendsList = (Object.entries(friendsData) as Array<[string, UserData]>).map(
      ([userId, userData]: [string, UserData]) => ({
        id: userData.id,
        profilePicture: userData.profilePicture,
        username: userData.username,
        isOnline: userData.isOnline,
        isPlaying: userData.isPlaying,
      }));
    setFriendsList(tmpFriendsList);
  }, [friendsData])

  const resetNotifMsg = () => {
    setNotifMsg(''); // Reset errMsg to an empty string
  };

  const resetIdToRemove = () => {
    setIdToRemove('none');
  };

  useEffect(() => {
    console.log('RMOVE FREND FLAG:', removeFlag, ' id to rm:', idToRemove);
    const removeUser = async (id: string | undefined) => {
      const dataToSend: any = {};
      if (id) dataToSend.id = id;
      try {
        const response = await axios.patch(
          API_ROUTES.ADD_FRIEND + id,
          dataToSend,
          {
            withCredentials: true
          }
        );
      } catch (err: any) {
        // Adequate error management
      }
      setRemoveFlag(false);
      setIdToRemove('none');
    };
    if (removeFlag) {
      removeUser(idToRemove);
    }
  }, [removeFlag, idToRemove]);

  const handleProfileClick = (user: User) => {
    setIdToRemove('none');
    resetNotifMsg();
    console.log('Profile clicked');
    history(APP_ROUTES.GENERIC_USER_PROFILE + user.id);
  }

  return (
    <main className="right-screen-container">
      <article className="friends-main-container" style={{}}>

        <header className="friends-header">
          Friends
        </header>

        <MDBContainer className="friends-container">
          <UserProfileList friendsList={friendsList} onProfileClick={handleProfileClick} />
        </MDBContainer>

        <ToastMessage notifMsg={notifMsg} resetNotifMsg={resetNotifMsg} changeRemoveFlag={truRemoveFlag} resetIdToRemove={resetIdToRemove} />
      </article>
    </main>
  );
}

export default Friends;
