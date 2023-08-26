import { useEffect, useState } from "react";
import axios, { } from "axios";
import { API_ROUTES, APP_ROUTES } from "../../Utils";
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";
import ToastErrorMessage from "../../Components/ToastErrorMessage";
import ToastNotificationMessage from "./Components/ToastNotificationMessage";
import { UserArray } from "../../Services/UserArray";
import LogoutParent from "../../LogoutHook/logoutParent";
import { FaHeart } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { connectSocket, getSocket, disconnectSocket, deregisterSocket } from "../../Websocket/Socket.io";
import { JsxEmit } from "typescript";
import socket from '../../Websocket/Socket.io';
import { Socket } from "socket.io-client";
import { UserData } from "../../Services/User";
import User from "../../Services/User";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useAppDispatch } from "../../redux/Hooks";
import { setUser } from "../../redux/slices/UserReducer";

const UserFriends = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataMain, setUserDataMain] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState<UserArray>([]);
  const [removeFlag, setRemoveFlag] = useState(false);
  const history = useNavigate();
  const [iconColor, setIconColor] = useState('red');
  const [notifMsg, setNotifMsg] = useState('');
  const [idToRemove, setIdToRemove] = useState<string | undefined>('none');
  const [friendOnlineStatus, setFriendOnlineStatus] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const socket = useWebsocketContext();
  const dispatchUser = useAppDispatch()

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  const truRemoveFlag = () => {
    setRemoveFlag(true); // Reset errMsg to an empty string
  };

  useEffect(() => {
    fetchFriends();

    const fetchFriendsInterval = setInterval(fetchFriends, 10000);

    return () => {
      clearInterval(fetchFriendsInterval);
    };
  }, []);

  const fetchFriends = async () => {
    // console.log('fetch friends entered!!!!');
    try {
      const response = await axios.get(API_ROUTES.USER_FRIENDS,
        {
          withCredentials: true
        });
      // console.log("ici:", response.data);
      dispatchUser(setUser(response.data))
      setUserData(userData);
      localStorage.setItem('userFriends', JSON.stringify(response.data.friends));
      let updatedUsers: User[] = [];
      response.data.friends.forEach((userDatat: any) => {
        let userInstance = new User();
        userInstance.setUserFromResponseData(userDatat);
        // Get user online status with socket.io
        updatedUsers.push(userInstance);
      });
      setUsers(updatedUsers);
    } catch (err: any) {
    }
  };

  const resetNotifMsg = () => {
    setNotifMsg(''); // Reset errMsg to an empty string
  };

  const resetIdToRemove = () => {
    setIdToRemove('none');
  };

  useEffect(() => {
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
      fetchFriends();
      setIdToRemove('none');
    };
    if (removeFlag) {
      removeUser(idToRemove);
    }
  }, [removeFlag, idToRemove]);

  const removeFriend = async (id: string | undefined) => {
    if (idToRemove === 'none') {
      setIdToRemove(id);
      setNotifMsg('Click here to confirm friend\'s removal');
    }
  }

  // const handleProfileClick = (user: User) => {
  //   setIdToRemove('none');
  //   resetNotifMsg();
  //   console.log('Profile clicked');
  //   history(APP_ROUTES.GENERIC_USER_PROFILE + user.getId());
  // }

  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', margin: '0px', }}>
      <MDBContainer className="friends-container">
        <MDBCard className="friends-card">

          <div className="friends">

            <header className="friends-header">

              <LogoutParent setErrMsg={setErrMsg} />

              <h1 className="friends__title">
                <span className="friends__title--top">
                  Friends
                </span>
                <span className="friends__title--bottom">
                  Pannel
                </span>
              </h1>
            </header>
          </div>

          <main className="friends__profiles">
            {users.map((user) => (
              <article className="friends__profile" key={user.getId()}>
                <img
                  src={user.getProfilePicture()}
                  alt={user.getUsername()}
                  className="friends__picture"
                />
                <button className="friends__name" title="Go to user profile"
                  key={user.getId()}
                // onClick={() => handleProfileClick(user)}
                >
                  {user.getUsername()}
                </button>

                <div className="friends__heart">


                  <span title={`${user.getIsOnline() ? 'online' : 'offline'}`}
                    className={`border friends__status-circle ${user.getIsOnline() ? 'online' : 'offline'}`}>
                    {user.getIsOnline() && <span className="ripple"></span>}
                  </span>

                  <button className="" onClick={() => removeFriend(user.getId())}>
                    <IconContext.Provider
                      value={{ color: iconColor, size: '30px' }}>
                      <FaHeart />
                    </IconContext.Provider>
                  </button>
                </div>

              </article>
            ))}
          </main>

        </MDBCard>
      </MDBContainer>
      <ToastNotificationMessage notifMsg={notifMsg} resetNotifMsg={resetNotifMsg} changeRemoveFlag={truRemoveFlag} resetIdToRemove={resetIdToRemove} />
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  );
}

export default UserFriends;