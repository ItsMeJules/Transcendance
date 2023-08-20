import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES, APP_ROUTES, APP_URL } from '../../Utils';
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import { UserData } from '../../Services/User';
import getProgressBarClass from '../../Components/ProgressBarClass';
import DisplayData from './components/DisplayData';
import DisplayStats from './components/DisplayStats';
import ProfilePicContainer from './components/ProfilePicContainer';
import LogoutParent from '../../LogoutHook/logoutParent';
import ToastErrorMessage from '../../Components/ToastErrorMessage';
import { FaHeart } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import UserProfileContainer from './components/UserProfileContainer';
import ProfileCard from './components/ProfileCard';

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
    <UserProfileContainer>
      <ProfileCard userData={userData} setErrMsg={setErrMsg} type="generic" iconColor={iconColor} onAddFriend={() => addFriend(id)} />
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </UserProfileContainer>
  );
};

export default GenericUserProfile;