import React, { useEffect, useReducer, useState, useRef } from "react";
import axios, { HttpStatusCode } from "axios";
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import User from "../services/user";
import Users from "../services/Users";
import { UserData } from "../services/user";
import { Link, useNavigate } from "react-router-dom";
import ToastErrorMessage from "../components/ToastErrorMessage";
import ToastNotificationMessage from "../components/ToastNotificationMessage";
import { UserArray } from "../services/UserArray";
import LogoutParent from "../hooks/logoutParent";
import { FaHeart } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const UserFriends = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [users, setUsers] = useState<UserArray>([]);
  const [removeFlag, setRemoveFlag] = useState(false);
  const history = useNavigate();
  const [iconColor, setIconColor] = useState('red');
  const [notifMsg, setNotifMsg] = useState('');
  const [idToRemove, setIdToRemove] = useState<string | undefined>('none');

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  const resetNotifMsg = () => {
    setNotifMsg(''); // Reset errMsg to an empty string
  };

  const truRemoveFlag = () => {
    setRemoveFlag(true); // Reset errMsg to an empty string
  };

  const resetIdToRemove = () => {
    setIdToRemove('none');
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(API_ROUTES.USER_FRIENDS,
        {
          withCredentials: true
        });
      console.log("ici:", response.data.friends);
      localStorage.setItem('userFriends', JSON.stringify(response.data.friends));
      let updatedUsers: User[] = [];
      response.data.friends.forEach((userDatat: any) => {
        let userInstance = new User();
        userInstance.setUserFromResponseData(userDatat);
        // console.log("instance", userInstance);
        updatedUsers.push(userInstance);
        // console.log('2: ', updatedUsers);
      });
      console.log('3: ', updatedUsers);
      setUsers(updatedUsers);
    } catch (err: any) {
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    const removeUser = async (id: string | undefined) => {
      const dataToSend: any = {};
      if (id) dataToSend.id = id;
      try {
        const response = await axios.patch(
          API_ROUTES.ADD_FRIEND + id,
          dataToSend,
          {
            withCredentials: true
          }
        );
        // Add logic to handle the response here if needed
      } catch (err: any) {
        // Adequate error management
      }
      setRemoveFlag(false);
      fetchFriends();
      setIdToRemove('none');
    };

    if (removeFlag) {
      // Call the removeUser function with the appropriate ID here
      // For example, if you have a user ID in state, you can use it like this:
      removeUser(idToRemove);
    }
  }, [removeFlag, idToRemove]);

  const removeFriend = async (id: string | undefined) => {
    console.log("idtorem:", idToRemove);
    if (idToRemove === 'none') {
      console.log("triggered");
      setIdToRemove(id);
      setNotifMsg('Click here to cancel friend\'s removal');
    }
    // perform only if the user didn't click on the notification message
    // try {
    //   const response = await axios.patch(
    //     API_ROUTES.ADD_FRIEND + id,
    //     dataToSend,
    //     {
    //       withCredentials: true
    //     });
    // } catch (err: any) {
    // adequate error management
  }

  // fetchFriends();


  return (
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', margin: '0px', }}>
      <MDBContainer className="leaderboard-container">
        <MDBCard className="leaderboard-card">

          <div className="leaderboard">

            <header className="leaderboard-header">

              <LogoutParent setErrMsg={setErrMsg} />

              <h1 className="leaderboard__title">
                <span className="leaderboard__title--top">
                  Friends
                </span>
                <span className="leaderboard__title--bottom">
                  Pannel
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
                <Link className="leaderboard__name" title="Show user profile"
                  style={{ textDecoration: 'none' }}
                  to={userData?.id == user.getId() ? APP_ROUTES.USER_PROFILE : APP_ROUTES.GENERIC_USER_PROFILE + user.getId()}
                  key={user.getId()}>
                  <span className="leaderboard__name">
                    {user.getUsername()}
                  </span>
                </Link>
                <span className="leaderboard__value">
                  <button onClick={() => removeFriend(user.getId())}>
                    <IconContext.Provider
                      value={{ color: iconColor, size: '30px' }}>
                      <FaHeart />
                    </IconContext.Provider>
                  </button>
                </span>
              </article>
            ))}
          </main>

        </MDBCard>
      </MDBContainer>
      <ToastNotificationMessage notifMsg={notifMsg} resetNotifMsg={resetNotifMsg} changeRemoveFlag={truRemoveFlag} resetIdToRemove={resetIdToRemove}/>
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  );

  return (
    <div></div>
  )
}

export default UserFriends;