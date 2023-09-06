import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import ToastError from "layout/ToastError/ToastError";
import User from "services/User/User";
import { UserData } from "services/User/User";
import './css/UserProfile.scss';
import './css/ProgressBar.scss';
import ProfileCard from "./components/ProfileCard";
import { useAppDispatch } from "utils/redux/Store";
import { setUser } from "utils/redux/reducers/UserSlice";

export const Profile: React.FC = () => {
  const [userDataProfile, setUserDataProfile] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [level, setLevel] = useState(0);
  const history = useNavigate();
  const dispatchUser = useAppDispatch();
  const customAxiosInstance = useAxios();

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  const fetchUserProfile = async () => {
    try {
      console.log('here');
      const response = await customAxiosInstance.get(
        "http://localhost:8000/api/users/complete-user",
        {
          withCredentials: true,
        }
      );
      const userData = response.data;
      console.log("response:", userData);
      dispatchUser(setUser(userData));
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserDataProfile(userData);
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
    <>
        <ProfileCard userData={userDataProfile} />
        <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </>
  );
}

export default Profile;
