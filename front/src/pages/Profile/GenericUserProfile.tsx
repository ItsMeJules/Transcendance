import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from 'utils/routing/routing';
import getProgressBarClass from 'utils/progressBar/ProgressBar';
import { UserData } from 'services/User/User';
import ProfileCard from './components/ProfileCard';
import { useWebsocketContext } from 'services/Websocket/Websocket';
import { toast } from 'react-toastify';
import NotFoundPageDashboard from 'pages/NotFoundPage/NotFoundDashboard';
import { useAxios } from 'utils/axiosConfig/axiosConfig';
import { useAppSelector, useAppDispatch } from 'utils/redux/Store';
import { removeUserBlocked, addUserBlocked } from 'utils/redux/reducers/UserSlice';
import './css/ProgressBar.scss'
import './css/UserProfile.scss'

const GenericUserProfile = () => {
  const chatSocket = useWebsocketContext().chat;
  const { id } = useParams();
  const [level, setLevel] = useState<number | null>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isBlocked = useAppSelector(state => state.user.userData.blockedUsers)?.some(blockedId => id !== undefined ? blockedId === parseInt(id) : false);
  getProgressBarClass(level);
  const customAxiosInstance = useAxios();
  const navigate = useNavigate();
  getProgressBarClass(level);

  useEffect(() => {
    const fetchUserProfile = async (id: string | undefined) => {
      try {
        const response = await customAxiosInstance.get(API_ROUTES.GENERIC_USER_PROFILE + id,
          {
            withCredentials: true
          });
        if (response.data === '') {
          toast.error("No user found");
          setUserNotFound(true);
          return;
        }
        let idcheck;
        if (response.data.data.user.user.id)
          idcheck = parseInt(response.data.data.user.user.id);
        if (idcheck === -1) navigate(APP_ROUTES.USER_PROFILE_ABSOLUTE);
        setUserData(response.data.data.user.user);
        setIsFriend(false);
        if (response.data.data.isFriend === 'true')
          setIsFriend(true);
        if (userData) {
          if (userData.userLevel)
            setLevel(userData.userLevel);
        }
      } catch (err: any) { }
    };
    fetchUserProfile(id);
  }, [id, location]);

  const addFriend = async (id: string | undefined) => {
    const dataToSend: any = {};
    if (id) dataToSend.id = id;
    try {
      const response = await customAxiosInstance.patch(
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

  const blockUser = async (id: string | undefined) => {
    const targetId = parseInt(id!);
    if (chatSocket) {
      chatSocket.emit("chat-action", {action: "block", targetId: targetId});
      isBlocked === true ? dispatch(removeUserBlocked(targetId)) : dispatch(addUserBlocked(targetId));
    } else { }
  }

  if (userNotFound) {
    return <NotFoundPageDashboard />;
  }

  return (
    <ProfileCard userData={userData} type="generic" isFriend={isFriend} onAddFriend={() => addFriend(id)} blockUser={() => blockUser(id)} isBlocked={isBlocked} />
  );
};


export default GenericUserProfile;
