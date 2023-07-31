import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { MDBContainer, MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import { UserData } from "../services/user";
import { useNavigate } from "react-router-dom";
import ToastErrorMessage from "../components/ToastErrorMessage";
import LogoutParent from "../hooks/logoutParent";
import ProfilePicContainer from "../UserProfile/components/ProfilePicContainer";
import ImageChange from "../UserProfileEdit/components/ImageChange";
import EditUserFormValidation from "../UserProfileEdit/components/EditUserFormValidation";

export const UserProfileEdit: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const history = useNavigate();

  const resetErrMsg = () => {
    setErrMsg('');
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
      setUsername(userData.username);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    } catch (err: any) {
      console.log("Error:" + err.response.data.message);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
        history(APP_ROUTES.HOME);
      } else if (err.response?.status === 403) {
        setErrMsg(`${err.response.data.message}`);
      }
      else {
        setErrMsg('Login failed');
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();

  //   const dataToSend: any = {};
  //   if (username) {
  //     dataToSend.username = username;
  //   }
  //   if (firstName) {
  //     dataToSend.firstName = firstName;
  //   }
  //   if (lastName) {
  //     dataToSend.lastName = lastName;
  //   }

  //   try {
  //     const response = await axios.patch(
  //       API_ROUTES.USER_PROFILE_EDIT,
  //       dataToSend,
  //       {
  //         withCredentials: true
  //       });
  //     const userData = response.data;
  //     localStorage.setItem('userData', JSON.stringify(userData));
  //     setUserData(userData);
  //     history(APP_ROUTES.USER_PROFILE);
  //   } catch (err: any) {
  //     console.log(err.response.data.message);
  //     if (!err?.response) {
  //       setErrMsg('No Server Response');
  //     } else if (err.response?.status === 400) {
  //       setErrMsg('Missing username');
  //     } else if (err.response?.status === 401) {
  //       setErrMsg('Unauthorized');
  //       history(APP_ROUTES.HOME);
  //     } else if (err.response?.status === 403) {
  //       setErrMsg(`${err.response.data.message}`);
  //     }
  //     else {
  //       setErrMsg('Login failed');
  //     }
  //   }
  // };

  return (
    <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
      <MDBContainer className="profile-board-container">
        <MDBCard className="profile-board-card">

          <div className="profil-board-header-edit-profile">
            <LogoutParent setErrMsg={setErrMsg} />
          </div>

          <ProfilePicContainer userData={userData} />

          <ImageChange setErrMsg={setErrMsg} fetchUserProfile={fetchUserProfile} />

          <div className="fade-line" style={{ marginTop: '20px' }}></div>


          <EditUserFormValidation setErrMsg={setErrMsg} userData={userData}/>

          {/* <div className="information-display-main">
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
            <MDBCardBody className="data-values-input-main">
              <form action="POST" onSubmit={handleSubmit}>
                <MDBTypography tag="h5" className="data-values-input-sub-first" title={userData?.email}>
                  {userData?.email}
                </MDBTypography>
                <input type="text" autoComplete="off" placeholder="Enter username" id="username" value={username}
                  className={`data-values-input-sub-second border edit-form-label`}
                  onChange={(e) => setUsername(e.target.value)} maxLength={100} />

                <input type="text" autoComplete="off" placeholder="Enter first name" id="firstname" value={firstName}
                  className={`data-values-input-sub-others border edit-form-label`}
                  onChange={(e) => setFirstName(e.target.value)} maxLength={100} />

                <input type="text" autoComplete="off" placeholder="Enter last name" id="lastname" value={lastName}
                  className={`data-values-input-sub-others border edit-form-label`}
                  onChange={(e) => setLastName(e.target.value)} maxLength={100} />

                <div className="save-button">
                  <button type="submit" className="save-changes-button" style={{ marginTop: '10px' }}>
                    Save changes
                  </button>
                </div>
              </form>

            </MDBCardBody>
          </div> */}

          <div className="d-flex justify-content-between text-center mt-5 mb-2">
          </div>
        </MDBCard>
      </MDBContainer>

      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />

    </div>
  );
}