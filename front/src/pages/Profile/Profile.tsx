import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAxios } from "utils/axiosConfig/axiosConfig";
// import User from "services/User/User";
import { UserData } from "services/User/User";
import './css/UserProfile.scss';
import './css/ProgressBar.scss';
import ProfileCard from "./components/ProfileCard";
import { useAppDispatch } from "utils/redux/Store";
import { setUser } from "utils/redux/reducers/UserSlice";
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get('error');
  const [userDataProfile, setUserDataProfile] = useState<UserData | null>(null);
  const dispatchUser = useAppDispatch();
  const customAxiosInstance = useAxios();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await customAxiosInstance.get(
          "http://localhost:8000/api/users/complete-user",
          {
            withCredentials: true,
          }
        );
        const userData = response.data;
        dispatchUser(setUser(userData));
        localStorage.setItem("userData", JSON.stringify(userData));
        setUserDataProfile(userData);
        // User.getInstance().setUserFromResponseData(userData);
      } catch (err: any) {
        console.log('errror profile:', err);
        // if (!err?.response) {
        //   setErrMsg('No Server Response');
        // } else if (err.response?.status === 400) {
        //   setErrMsg('Bad request');
        // } else if (err.response?.status === 401) {
        //   setErrMsg('Unauthorized');
        //   history(APP_ROUTES.HOME);
        // }
        // else {
        //   setErrMsg('Error');
        // }
      }
    };
    if (errorMessage === 'alreadyverified')
      toast.error('You are already verified!');
    if (errorMessage === 'no2fa')
      toast.error("You don't have 2FA enabled");
    fetchUserProfile();
  }, []);

  return (
    <>
      <ProfileCard userData={userDataProfile} />
    </>
  );
}

export default Profile;
