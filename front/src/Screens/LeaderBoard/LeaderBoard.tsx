import React, { useEffect, useState } from "react";
import axios, { } from "axios";
import { API_ROUTES, APP_ROUTES } from "../../Utils";
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import User from "../../Services/User";
import { Link, useNavigate } from "react-router-dom";
import ToastErrorMessage from "../../Components/ToastErrorMessage";
import { UserArray } from "../../Services/UserArray";
import LogoutParent from "../../LogoutHook/logoutParent";
import { UserData } from "../../Services/User";

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

      // console.log("ici:", response.data);
      localStorage.setItem('leaderboardData', JSON.stringify(response.data));

      // let userInstance = User.getInstance();
      // console.log("1 User:", userInstance);


      let updatedUsers: User[] = [];


      // console.log('1: ', updatedUsers);

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
    <div className="vh-100 d-flex" style={{ paddingTop: '75px', margin: '0px', }}>
      <MDBContainer className="leaderboard-container">
        <MDBCard className="leaderboard-card">

          <div className="leaderboard">

            <header className="leaderboard-header">

              <LogoutParent setErrMsg={setErrMsg} />

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

              <Link title="Show user profile"
                style={{ textDecoration: 'none' }}
                to={userData?.id === user.getId() ? APP_ROUTES.USER_PROFILE  : APP_ROUTES.GENERIC_USER_PROFILE + user.getId()}
                key={user.getId()}>
                <article className="leaderboard__profile" key={user.getId()}>
                  <img
                    src={user.getProfilePicture()}
                    alt={user.getUsername()}
                    className="leaderboard__picture"
                  />
                  <span className="leaderboard__name">{user.getUsername()}</span>
                  <span className="leaderboard__value">{user.getUserPoints()}</span>
                </article>
              </Link>

            ))}
          </main>

        </MDBCard>
      </MDBContainer>
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  );

}

export default LeaderBoard;