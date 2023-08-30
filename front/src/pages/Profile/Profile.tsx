import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import ToastError from "layout/ToastError/ToastError";
import User from "services/User/User";
import { UserData } from "services/User/User";
import { MDBContainer } from 'mdb-react-ui-kit';

import './css/UserProfile.scss';
import './css/ProgressBar.scss';

import ProfileCard from "./components/ProfileCard";
import UserProfileContainer from "./components/UserProfileContainer";
import ProfileHeader from "pages/Dashboard/components/ProfileHeader";
import NavFooter from "pages/Dashboard/components/NavFooter";
import RightScreen from "pages/Dashboard/components/RightScreen";

export const Profile: React.FC = () => {
  const [rightContent, setRightContent] = useState<number>(-1);
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
    <main className="dashboard-main-container">


      <ProfileHeader />

      <article className="screen-container">
        <section className="left-screen-container">
          <body className="profile-main-container">
            <MDBContainer className="profile-board-container">
              <ProfileCard userData={userDataHere} setErrMsg={setErrMsg} />
            </MDBContainer>
          </body>
        </section>

        <RightScreen rightContent={rightContent} />
      </article>

      <NavFooter setRightContent={setRightContent} />

    </main>
  );
}

export default Profile;
