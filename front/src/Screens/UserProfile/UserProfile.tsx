import React, { useEffect, useState } from "react";
import { API_ROUTES, APP_ROUTES } from "../../Utils/constants";
import { Link, useNavigate } from "react-router-dom";
import ToastErrorMessage from "../../Components/ToastErrorMessage";
import getProgressBarClass from "../../Components/ProgressBarClass";
import User from "../../Services/User";
import { UserData } from "../../Services/User";
import { useAxios } from "../../api/axios-config";
import ProfileCard from "./components/ProfileCard";
import UserProfileContainer from "./components/UserProfileContainer";

export const UserProfile: React.FC = () => {
  const [userDataHere, setUserDataHere] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [level, setLevel] = useState(0);
  const progressBarClass = getProgressBarClass(level);
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
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </UserProfileContainer>
  );
}