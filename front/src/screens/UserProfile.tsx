import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBContainer, MDBCard, MDBCardImage } from 'mdb-react-ui-kit';
import { UserData } from '../services/user';
import { Link, useNavigate } from "react-router-dom";
import ToastErrorMessage from "../components/ToastErrorMessage";
import getProgressBarClass from "../components/ProgressBarClass";
import DisplayData from "../UserProfile/components/DisplayData";
import DisplayStats from "../UserProfile/components/DisplayStats";
import ProfilePicContainer from "../UserProfile/components/ProfilePicContainer";
import LogoutParent from "../hooks/logoutParent";

export const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [level, setLevel] = useState(0);
  const progressBarClass = getProgressBarClass(level);
  const history = useNavigate();

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
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
      User.getInstance().setUserFromResponseData(userData);
      setLevel(User.getInstance().getUserLevel());
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');        // OK
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
    <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>

      <MDBContainer className="profile-board-container">
        <MDBCard className="profile-board-card">
          <div className="profile-board-header-show-profile">

            <Link title="Edit profile" to={APP_ROUTES.USER_PROFILE_EDIT} style={{ padding: '0px' }}>
              <MDBCardImage src='/images/edit_profile.png' fluid style={{ width: '30px' }} />
            </Link>

            <LogoutParent setErrMsg={setErrMsg} />
          </div>

          <ProfilePicContainer userData={userData} />

          <div className="fade-line" style={{ marginTop: '20px' }}></div>

          <DisplayData userData={userData} />

          <div className="fade-line" style={{ marginTop: '-10px' }}></div>

          <DisplayStats userData={userData} />

        </MDBCard>
      </MDBContainer>
      
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />

    </div>
  );

}