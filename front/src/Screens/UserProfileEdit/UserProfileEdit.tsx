import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../../Utils/constants";
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import { UserData } from "../../Services/User";
import { useNavigate } from "react-router-dom";
import ToastErrorMessage from "../../Components/ToastErrorMessage";
import LogoutParent from "../../LogoutHook/logoutParent";
import ProfilePicContainer from "../UserProfile/components/ProfilePicContainer";
import ImageChange from "./components/ImageChange";
import EditUserFormValidation from "./components/EditUserFormValidation";
import { useAppDispatch } from "../../redux/Hooks";
import { setUser } from "../../redux/slices/UserReducer";

export const UserProfileEdit: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const history = useNavigate();
  const dispatchUser = useAppDispatch()

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
      dispatchUser(setUser(response.data))
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
          <EditUserFormValidation setErrMsg={setErrMsg} userData={userData} />
          <div className="d-flex justify-content-between text-center mt-5 mb-2">
          </div>
        </MDBCard>
      </MDBContainer>

      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />

    </div>
  );
}