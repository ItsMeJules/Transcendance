import React, { useDebugValue, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES, APP_ROUTES } from '../utils';
import User from '../services/user';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { UserData } from '../services/user';
import getProgressBarClass from "../components/ProgressBarClass";
import DisplayData from './components/DisplayData';
import DisplayStats from './components/DisplayStats';
import ProfilePicContainer from './components/ProfilePicContainer';

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
          <ProfilePicContainer userData={userData} />
          <div className="fade-line" style={{ marginTop: '20px' }}></div>
          <DisplayData userData={userData} />
          <div className="fade-line" style={{ marginTop: '-10px' }}></div>
          <DisplayStats userData={userData} />
        </MDBCard>
      </MDBContainer>

      {/* <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} /> */}

    </div>
  );
};

export default GenericUserProfile;