import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { API_ROUTES, APP_ROUTES, APP_URL } from 'utils/routing/routing';
import getProgressBarClass from 'utils/progressBar/ProgressBar';
import ToastError from 'layout/ToastError/ToastError';
import { UserData } from 'services/User/User';
import UserProfileContainer from './components/UserProfileContainer';
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
  const [iconColor, setIconColor] = useState('rgba(255, 255, 255, 0.7)');
  const [errMsg, setErrMsg] = useState('');
  const history = useNavigate();
  getProgressBarClass(level);

  const resetErrMsg = () => {
    setErrMsg('');
  }

  useEffect(() => {
    const fetchUserProfile = async (id: string | undefined) => {
      try {
        console.log('HEREEEEEEEEEEE and id:', id);
        const response = await axios.get(API_ROUTES.GENERIC_USER_PROFILE + id,
          {
            withCredentials: true
          });
        if (response.data.data.user.user === null) {
          setUserNotFound(true);
          return;
        }
        console.log('data:', response.data.data.user.user.id);
        if (response.data.data.user.user.id === -1)
          history(APP_ROUTES.USER_PROFILE_ABSOLUTE);
        localStorage.setItem('genericUserData', JSON.stringify(response.data.data.user.user));
        setUserData(response.data.data.user.user);

        if (response.data.data.friendStatus === 'Is friend')
          setIconColor('rgba(255, 0, 0, 0.7)');
        if (response.data.redirectTo === APP_URL + APP_ROUTES.USER_PROFILE)
          window.location.href = APP_ROUTES.USER_PROFILE;
        if (userData)
          setLevel(userData?.userLevel);


      } catch (err: any) {
        console.log('error end stauts:', err.response?.status);
        if (err.response?.status === 400)
          setUserNotFound(true);
        // console.log('error:', err);
        // adequate error management
      }
    };

    fetchUserProfile(id);
  }, [id]);

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
      if (response.data.friendStatus === 'Is friend')
        setIconColor('rgba(255, 0, 0, 0.7)');
      else
        setIconColor('rgba(255, 255, 255, 0.7)');
    } catch (err: any) {
      // adequate error management
    }
  }

  if (userNotFound) {
    return <NotFoundPageDashboard />;
  }

  return (
    <section className="profile-main-container">
      <MDBContainer className="profile-board-container">
        <ProfileCard userData={userData} setErrMsg={setErrMsg} type="generic" iconColor={iconColor} onAddFriend={() => addFriend(id)} />
        <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
      </MDBContainer>
    </section>
  );
};

export default GenericUserProfile;
