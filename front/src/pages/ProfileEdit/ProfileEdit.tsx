import React, { useEffect, useState } from "react";
import axios from "axios";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { UserData } from "services/User/User";
import { useNavigate } from "react-router-dom";
import ToastError from "layout/ToastError/ToastError";
import ProfileCard from "pages/Profile/components/ProfileCard";

export const ProfileEdit: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const history = useNavigate();

  const resetErrMsg = () => {
    setErrMsg('');
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(API_ROUTES.USER_PROFILE,
        {
          withCredentials: true
        });
      const userData = response.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserData(userData);
    } catch (err: any) {
      console.log("Error:" + err.response.data.message);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
        history(APP_ROUTES.HOME);
      } else if (err.response?.status === 403) {
        setErrMsg(`${err.response.data.message}`);
      }
      else {
        setErrMsg('Login failed');
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
    <ProfileCard userData={userData} type="edit" fetchUserProfile={fetchUserProfile} />
    <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </>
  );
}

export default ProfileEdit;
