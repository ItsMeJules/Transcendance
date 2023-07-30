import React, { useEffect, useReducer, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import { UserData } from "../services/user";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Cookies from 'js-cookie';
import ToastErrorMessage from "../components/ToastErrorMessage";
import getProgressBarClass from "../components/ProgressBarClass";

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

  const handleLogout = async () => {
    try {
      const response = await axios.post(API_ROUTES.LOG_OUT, null, {
        withCredentials: true,
      });
      if (response.status === 201) {
        history(APP_ROUTES.HOME);
      } else {
        console.error('Logout failed:', response.status);
      }
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
        setErrMsg('Logout failed');
      }
    }
  }

  return (
    <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
      <MDBContainer className="profile-board-container">
        <MDBCard className="profile-board-card">

          <div className="profile-board-header-show-profile">
            <Link title="Edit profile" to={APP_ROUTES.USER_PROFILE_EDIT} style={{ padding: '0px' }}>
              <MDBCardImage src='/images/edit_profile.png' fluid style={{ width: '30px' }} />
            </Link>
            <button title="Log out" onClick={handleLogout}>
              <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
            </button>
          </div>

          <div className="profile-pic-container">
            {User.getInstance().getProfilePicture() ? (
              <div className="profile-pic-circle">
                <img src={User.getInstance().getProfilePicture()} alt="" />
              </div>
            ) : (
              <div className="empty-profile-picture-container">
                <span style={{ fontSize: '1rem' }}>No profile picture</span>
              </div>
            )}
          </div>

          <div className="fade-line" style={{ marginTop: '20px' }}></div>

          <div className="information-display-main">
            <MDBCardBody className="data-fields-name-main">
              <MDBTypography className="data-fields-name-sub-first" tag="h5">
                Email
              </MDBTypography>
              <MDBTypography className="data-fields-name-sub-others" tag="h5">
                Username
              </MDBTypography>
              <MDBTypography className="data-fields-name-sub-others" tag="h5">
                First name
              </MDBTypography>
              <MDBTypography className="data-fields-name-sub-others" tag="h5">
                Last name
              </MDBTypography>
            </MDBCardBody>
            <MDBCardBody className="data-values-main">
              <MDBTypography tag="h5" className="data-values-sub-first" title={User.getInstance().getData()?.email}>
                {User.getInstance().getData()?.email}
              </MDBTypography>
              <MDBTypography tag="h5" className="data-values-sub-others" title={User.getInstance().getData()?.username}>
                {User.getInstance().getData()?.username}
              </MDBTypography>
              <MDBTypography tag="h5" className="data-values-sub-others" title={User.getInstance().getData()?.firstName}>
                {User.getInstance().getData()?.firstName}
              </MDBTypography>
              <MDBTypography tag="h5" className="data-values-sub-others" title={User.getInstance().getData()?.lastName}>
                {User.getInstance().getData()?.lastName}
              </MDBTypography>
            </MDBCardBody>
          </div>

          <div className="fade-line" style={{ marginTop: '-10px' }}></div>

          <div className="stats-first-container">
            <div className="stats-first-sub-container">
              <MDBCardText className="mb-1 h5">
                {User.getInstance().getGamesPlayed()}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0">
                Games played
              </MDBCardText>
            </div>

            <div className="stats-first-sub-container">
              <MDBCardText className="mb-1 h5">
                {User.getInstance().getGamesWon()}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0">
                Games won
              </MDBCardText>
            </div>
          </div>
          <div className="stats-second-container">
            <div className="stats-second-sub-container">
              <MDBCardText className="mb-1 h5">
                {User.getInstance().getUserPoints()}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0">
                Points won
              </MDBCardText>
            </div>

            <div className="stats-second-sub-container">
              <div className={`progress-bar ${progressBarClass}`}></div>

              <MDBCardText className="small mt-0.5 text-muted mb-0">
                Level {User.getInstance().getUserLevel()}
              </MDBCardText>
            </div>

          </div>
        </MDBCard>
      </MDBContainer>

      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />

    </div>
  );

}