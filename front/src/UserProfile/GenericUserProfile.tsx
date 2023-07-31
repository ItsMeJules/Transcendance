import React, { useDebugValue, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES, APP_ROUTES } from '../utils';
import User from '../services/user';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { UserData } from '../services/user';
import getProgressBarClass from "../components/ProgressBarClass";


interface UserProfileProps {
  id: number;
}

const GenericUserProfile: React.FC<UserProfileProps> = ({ }) => {
  const { id } = useParams();
  const [level, setLevel] = useState<number | null>(0);
  const [dataFetched, setDataFetched] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const history = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const progressBarClass = getProgressBarClass(level);


  const fetchUserProfile = async (id: string | undefined) => {
    try {
      const response = await axios.get(API_ROUTES.GENERIC_USER_PROFILE + id,
        {
          withCredentials: true
        });
      localStorage.setItem('generciUserData', JSON.stringify(response.data));
      setUserData(response.data);
      // console.log(userData);
      if (userData)
        setLevel(userData?.userLevel);
      setDataFetched(true); // Set dataFetched to true after fetching the user data

    } catch (err: any) {
    }
  };

  useEffect(() => {
    fetchUserProfile(id);
  }, [id]);

  // Add some loading handling while user data is fetched
  if (!dataFetched) {
    return <div>Loading...</div>;
  }

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
            <button title="Log out" onClick={handleLogout}>
              <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
            </button>
          </div>

          <div className="profile-pic-container">
            {userData?.profilePicture ? (
              <div className="profile-pic-circle">
                <img src={userData.profilePicture} alt="" />
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
              <MDBTypography tag="h5" className="data-values-sub-first" title={userData?.email}>
                {userData?.email}
              </MDBTypography>
              <MDBTypography tag="h5" className="data-values-sub-others" title={userData?.username}>
                {userData?.username}
              </MDBTypography>
              <MDBTypography tag="h5" className="data-values-sub-others" title={userData?.firstName}>
                {userData?.firstName}
              </MDBTypography>
              <MDBTypography tag="h5" className="data-values-sub-others" title={userData?.lastName}>
                {userData?.lastName}
              </MDBTypography>
            </MDBCardBody>
          </div>

          <div className="fade-line" style={{ marginTop: '-10px' }}></div>

          <div className="stats-first-container">
            <div className="stats-first-sub-container">
              <MDBCardText className="mb-1 h5">
                {userData?.gamesPlayed}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0">
                Games played
              </MDBCardText>
            </div>

            <div className="stats-first-sub-container">
              <MDBCardText className="mb-1 h5">
                {userData?.gamesWon}
              </MDBCardText>
              <MDBCardText className="small text-muted mb-0">
                Games won
              </MDBCardText>
            </div>
          </div>
          <div className="stats-second-container">
            <div className="stats-second-sub-container">
              <MDBCardText className="mb-1 h5">
                {userData?.userPoints}
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

      {/* <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} /> */}

    </div>
  );
};

export default GenericUserProfile;