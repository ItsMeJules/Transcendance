import React, { useEffect, useReducer, useState, useRef } from "react";
import axios, { HttpStatusCode } from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import User from "../services/user";
import Users from "../services/Users";
import { UserData } from "../services/user";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import useLogout from "../hooks/useLogout";
import Cookies from 'js-cookie';
import ToastErrorMessage from "../components/ToastErrorMessage";
import getProgressBarClass from "../components/ProgressBarClass";
import { UserArray } from "../services/UserArray";
import './LeaderBoard.scss'


const LeaderBoard: React.FC = () => {
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState<UserArray>([]);
  const history = useNavigate();

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

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

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(API_ROUTES.GET_LEADERBOARD,
        {
          withCredentials: true
        });

      console.log("ici:", response.data);
      localStorage.setItem('leaderboardData', JSON.stringify(response.data));

      // let userInstance = User.getInstance();
      // console.log("1 User:", userInstance);
      let updatedUsers: User[] = [];
      console.log('1: ', updatedUsers);

      response.data.forEach((userDatat: any) => {
        let userInstance = new User();
        userInstance.setUserFromResponseData(userDatat);
        console.log("instance", userInstance);
        updatedUsers.push(userInstance);
        console.log('2: ', updatedUsers);
      });

      console.log('3: ', updatedUsers);
      setUsers(updatedUsers);

    } catch (err: any) {


    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', margin: '0px', }}>
      <MDBContainer className="profile-board-container">
        <MDBCard className="profile-board-card" style={{ textAlign: 'center', height: '600px' }}>

          <div className="leaderboard">

            <header className="leaderboard-header">

              <div className="leaderboard-logout">
                <button title="Log out" onClick={handleLogout}>
                  <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
                </button>
              </div>

              <h1 className="leaderboard__title">
                <span className="leaderboard__title--top">
                  Transcendance
                </span>
                <span className="leaderboard__title--bottom">
                  Leaderboard
                </span>
              </h1>
            </header>
          </div>

          <main className="leaderboard__profiles">
            {users.map((user) => (
              <article className="leaderboard__profile" key={user.getId()}>
                <img
                  src={user.getProfilePicture()}
                  alt={user.getUsername()}
                  className="leaderboard__picture"
                />
                <span className="leaderboard__name">{user.getUsername()}</span>
                <span className="leaderboard__value">{user.getUserPoints()}</span>
              </article>
            ))}
          </main>

        </MDBCard>
      </MDBContainer>
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  );

}

export default LeaderBoard;