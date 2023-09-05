import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { API_ROUTES, APP_ROUTES, APP_URL } from 'utils/routing/routing';
import getProgressBarClass from 'utils/progressBar/ProgressBar';
import ToastError from 'layout/ToastError/ToastError';
import { UserData } from 'services/User/User';
import ProfileCard from './components/ProfileCard';
import { MDBContainer } from 'mdb-react-ui-kit';

import './css/ProgressBar.scss'
import './css/UserProfile.scss'
import NotFoundPageDashboard from 'pages/NotFoundPage/NotFoundDashboard';


const GenericUserProfile = () => {



  const { id } = useParams();
  const [level, setLevel] = useState<number | null>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const location = useLocation();
  const history = useNavigate();
  getProgressBarClass(level);

  const resetErrMsg = () => {
    setErrMsg('');
  }

  useEffect(() => {
    const fetchUserProfile = async (id: string | undefined) => {
      try {
        // console.log(' ');
        // console.log(' ');
        // console.log('HEREEEEEEEEEEE and id:', id, '<<<<<<<<<<<');
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
    console.log("Inside useEffect, id:", id);

    fetchUserProfile(id);
  }, [id, location]);

    useEffect(() => {
      console.log("isFriend:", isFriend);
    }, [isFriend]);

  const addFriend = async (id: string | undefined) => {
     console.log("addFriend called with id:", id);
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
        console.log('ADD RESPONSE:', response.data);
      setIsFriend(false);
      if (response.data.isFriend === 'true') {
        console.log('OK INSIDE TRUE');
        setIsFriend(true);
      }
    } catch (err: any) {
      // adequate error management
    }
  }

  console.log('Rendering GenericUserProfile with isFriend:', isFriend);
  
  if (userNotFound) {
    return <NotFoundPageDashboard />;
  }

  return (
    <section className="profile-main-container">
      <MDBContainer className="profile-board-container">
        <ProfileCard userData={userData} type="generic" isFriend={isFriend} onAddFriend={() => addFriend(id)} />
      </MDBContainer>
    </section>
  );
};

export default GenericUserProfile;
