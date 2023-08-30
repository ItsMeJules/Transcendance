import React, { useEffect, useState } from "react";
import axios, { } from "axios";
import { useNavigate } from "react-router-dom";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import ToastError from "layout/ToastError/ToastError";
import User from "services/User/User";
import { UserArray } from "services/User/UserArray";
import { UserData } from "services/User/User";

import LeaderBoardHeader from "./components/LeaderBoardHeader";
import UserProfilesList from "./components/UserProfileList";
import LeaderBoardContainer from "./components/LeaderBoardContainer"
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';

import './css/LeaderBoard.scss';

const LeaderBoard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState<UserArray>([]);
  const history = useNavigate();
  // const userDataStore = useSelector((state: RootState) => state.user);

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(API_ROUTES.GET_LEADERBOARD,
        {
          withCredentials: true
        });
      localStorage.setItem('leaderboardData', JSON.stringify(response.data));
      let updatedUsers: User[] = [];
      response.data.forEach((userDatat: any) => {
        let userInstance = new User();
        userInstance.setUserFromResponseData(userDatat);
        // console.log("instance", userInstance);
        updatedUsers.push(userInstance);
        // console.log('2: ', updatedUsers);
      });

      // console.log('3: ', updatedUsers);
      setUsers(updatedUsers);

    } catch (err: any) {


    }
  };

  useEffect(() => {
    // console.log("userdata from store:", userDataStore);
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

    fetchUserProfile();
    fetchLeaderboard();
  }, [history]);

  return (
    <main className="right-screen-container">
      <body className="leaderboard-main-container">

        <header className="leaderboard-header">
          Leaderboard
        </header>

        <MDBContainer className="leaderboard-container">
          <UserProfilesList users={users} currentUserId={userData?.id} />
        </MDBContainer>

      </body>
    </main>
  );
}

export default LeaderBoard;
