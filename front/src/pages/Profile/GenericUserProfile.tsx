import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import { API_ROUTES } from 'utils/routing/routing';
import getProgressBarClass from 'utils/progressBar/ProgressBar';
import { UserData } from 'services/User/User';
import ProfileCard from './components/ProfileCard';
import { useWebsocketContext } from 'services/Websocket/Websocket';
import { useAppSelector } from 'utils/redux/Store';

import './css/ProgressBar.scss'
import './css/UserProfile.scss'
import NotFoundPageDashboard from 'pages/NotFoundPage/NotFoundDashboard';


const GenericUserProfile = () => {

  const chatSocket = useWebsocketContext().chat;  
  const { id } = useParams();
  const [level, setLevel] = useState<number | null>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const location = useLocation();
  const isBlocked = useAppSelector(state => state.user.userData.blockedUsers)?.some(blockedId => id !== undefined ? blockedId === parseInt(id) : false);
  getProgressBarClass(level);

  useEffect(() => {
    const fetchUserProfile = async (id: string | undefined) => {
      try {
        const response = await axios.get(API_ROUTES.GENERIC_USER_PROFILE + id,
          {
            withCredentials: true
          });
        if (response.data.data.user.user === null) {
          setUserNotFound(true);
          return;
        }
        setUserData(response.data.data.user.user);
        setIsFriend(false);
        if (response.data.data.isFriend === 'true')
          setIsFriend(true);
        if (userData)
          setLevel(userData?.userLevel);
      } catch (err: any) {
        if (err.response?.status === 400) setUserNotFound(true);
      }
    };
    fetchUserProfile(id);
  }, [id, location]);

  const addFriend = async (id: string | undefined) => {
    const dataToSend: any = {};
    if (id)
      dataToSend.id = id;
    try {
      const response = await axios.patch(
        API_ROUTES.ADD_FRIEND + id,
        dataToSend,
        {
          withCredentials: true
        });
      setIsFriend(false);
      if (response.data.isFriend === 'true') {
        setIsFriend(true);
      }
    } catch (err: any) {
      if (err.response?.status === 400) setUserNotFound(true);
    }
  }

  const blockUser = async (id: string | undefined)  => {
    const targetId = parseInt(id!);
    if (chatSocket) {
      chatSocket.emit("chat-action", {action: "block", targetId: targetId});
    }
  }

  if (userNotFound) {
    return <NotFoundPageDashboard />;
  }

  return (
        <ProfileCard userData={userData} type="generic" isFriend={isFriend} onAddFriend={() => addFriend(id)} blockUser={() => blockUser(id)} isBlocked={isBlocked} />
  );
};

export default GenericUserProfile;
