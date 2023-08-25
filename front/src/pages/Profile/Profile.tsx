import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import ToastError from "layout/ToastError/ToastError";
import User from "services/User/User";
import { UserData } from "services/User/User";

import ProfileCard from "./components/ProfileCard";
import UserProfileContainer from "./components/UserProfileContainer";

export const Profile: React.FC = () => {
  const [userDataHere, setUserDataHere] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [level, setLevel] = useState(0);
  const history = useNavigate();
  const axiosInstanceError = useAxios();

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  const fetchUserProfile = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        console.log('dispatching 1 and parsed ud', parsedUserData);
        // dispatch(setUserData(parsedUserData));
      }

      const response = await axiosInstanceError.get(API_ROUTES.USER_PROFILE, {
        withCredentials: true,
      });
      const userData = response.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserDataHere(userData);
      User.getInstance().setUserFromResponseData(userData);
      setLevel(User.getInstance().getUserLevel());
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Bad request');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
        history(APP_ROUTES.HOME);
      }
      else {
        setErrMsg('Error');
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogoutError = (error: string) => {
    setErrMsg(error);
    console.log("Error", error);
  };

  return (
    <UserProfileContainer>
      <ProfileCard userData={userDataHere} setErrMsg={setErrMsg}/>
      <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </UserProfileContainer>
  );
}

export default Profile;
