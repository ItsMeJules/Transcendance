import { useEffect, useState } from "react";
import axios, { } from "axios";
import { useNavigate } from "react-router-dom";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import ToastError from "layout/ToastError/ToastError";
import ToastMessage from "layout/ToastMessage/ToastMessage";
import { UserArray } from "services/User/UserArray";
import { UserData } from "services/User/User";
import User from "services/User/User";

import FriendsHeader from "./Components/FriendsHeader";
import UserProfileList from "./Components/UserProfileList";
import FriendsContainer from "./Components/FriendsContainer";

import './css/friends.scss';

const UserFriends = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState<UserArray>([]);
  const [removeFlag, setRemoveFlag] = useState(false);
  const history = useNavigate();
  const [notifMsg, setNotifMsg] = useState('');
  const [idToRemove, setIdToRemove] = useState<string | undefined>('none');

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
      localStorage.setItem('userData', JSON.stringify(response.data));
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

  const handleProfileClick = (user: User) => {
    setIdToRemove('none');
    resetNotifMsg();
    console.log('Profile clicked');
    history(APP_ROUTES.GENERIC_USER_PROFILE + user.getId());
  }

  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', margin: '0px', }}>
      
      <FriendsContainer>
        <FriendsHeader setErrMsg={setErrMsg} />
        <UserProfileList users={users} onRemoveClick={removeFriend} onProfileClick={handleProfileClick}/>
      </FriendsContainer>

      <ToastMessage notifMsg={notifMsg} resetNotifMsg={resetNotifMsg} changeRemoveFlag={truRemoveFlag} resetIdToRemove={resetIdToRemove} />
      <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  );
}

export default UserFriends;
