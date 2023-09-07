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
  const [errMsg, setErrMsg] = useState('');
  const location = useLocation();
  const isBlocked = useAppSelector(state => state.user.userData.blockedUsers)?.some(blockedId => id !== undefined ? blockedId === parseInt(id) : false);
  getProgressBarClass(level);

const blockUser = () => {
  const targetId = parseInt(id!);
  if (chatSocket) {
    chatSocket.emit("chat-action", {action: "block", targetId: targetId});
  } else {
    console.log("chatSocket is null");
  }
}

  const resetErrMsg = () => {
    setErrMsg('');
  }

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

    // useEffect(() => {
    //   console.log("isFriend:", isFriend);
    // }, [isFriend]);

  const addFriend = async (id: string | undefined) => {
    //  console.log("addFriend called with id:", id);
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
        // console.log('ADD RESPONSE:', response.data);
      setIsFriend(false);
      if (response.data.isFriend === 'true') {
        // console.log('OK INSIDE TRUE');
        setIsFriend(true);
      }
    } catch (err: any) {
      // adequate error management
    }
  }

  // console.log('Rendering GenericUserProfile with isFriend:', isFriend);
  
  if (userNotFound) {
    return <NotFoundPageDashboard />;
  }

  return (
        <ProfileCard userData={userData} type="generic" isFriend={isFriend} onAddFriend={() => addFriend(id)} blockUser={blockUser} isBlocked={isBlocked} />
  );
};

export default GenericUserProfile;
