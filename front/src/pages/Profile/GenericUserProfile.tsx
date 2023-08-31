import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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


const GenericUserProfile = () => {
  const { id } = useParams();
  const [level, setLevel] = useState<number | null>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [iconColor, setIconColor] = useState('black');
  const [errMsg, setErrMsg] = useState('');
  getProgressBarClass(level);

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
        localStorage.setItem('genericUserData', JSON.stringify(response.data.data.user.user));
        // console.log(response.data);
        setUserData(response.data.data.user.user);

        if (response.data.data.friendStatus === 'Is friend')
          setIconColor('red');
        if (response.data.redirectTo === APP_URL + APP_ROUTES.USER_PROFILE)
          window.location.href = APP_ROUTES.USER_PROFILE;
        if (userData)
          setLevel(userData?.userLevel);


      } catch (err: any) {
        // adequate error management
      }
    };

    fetchUserProfile(id);
  }, [id, userData]);

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
        setIconColor('red');
      else
        setIconColor('black');
    } catch (err: any) {
      // adequate error management
    }
  }


  return (
    <main className="screen-container">
      <section className="left-screen-container">
        <section className="profile-main-container">
          <MDBContainer className="profile-board-container">
            <ProfileCard userData={userData} setErrMsg={setErrMsg} type="generic" iconColor={iconColor} onAddFriend={() => addFriend(id)} />
            <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
          </MDBContainer>
        </section>
      </section>
    </main>
  );
};

export default GenericUserProfile;