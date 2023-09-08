import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { UserData } from "services/User/User";
import { useNavigate } from "react-router-dom";
import ToastError from "layout/ToastError/ToastError";
import ProfileCard from "pages/Profile/components/ProfileCard";

export const ProfileEdit: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [, setUsername] = useState('');
  const [, setFirstName] = useState('');
  const [, setLastName] = useState('');
  const navigate = useNavigate();

  const resetErrMsg = () => {
    setErrMsg('');
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(API_ROUTES.USER_PROFILE, {
        withCredentials: true,
      });
      const userData = response.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserData(userData);
      setUsername(userData.username);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    } catch (err: any) {
      console.error("Error:", err);
      if (!err.response) {
        setErrMsg('No Server Response');
      } else if (err.response.status === 400) {
        setErrMsg('Missing username');
      } else if (err.response.status === 401) {
        setErrMsg('Unauthorized');
        navigate(APP_ROUTES.HOME); ;
      } else if (err.response.status === 403) {
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg('Login failed');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);


  return (
    <>
    <ProfileCard userData={userData} type="edit" fetchUserProfile={fetchUserProfile} />
    <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </>
  );
}

export default ProfileEdit;
