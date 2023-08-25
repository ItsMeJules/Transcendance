import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../../utils/routing";
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import { UserData } from "../../services/User/User";
import { useNavigate } from "react-router-dom";
import ToastErrorMessage from "../../layout/ToastErrorMessage";
import ProfileHeader from './components/ProfileHeader';
import ProfilePicContainer from "./components/ProfilePicContainer";
import ImageChange from "./components/ImageChange";
import EditUserFormValidation from "./components/EditUserFormValidation";
import UserProfileContainer from "./components/UserProfileContainer";
import ProfileCard from "./components/ProfileCard";

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

  return (
    <UserProfileContainer>
      <ProfileCard userData={userData} setErrMsg={setErrMsg} type="edit" fetchUserProfile={fetchUserProfile} />
      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </UserProfileContainer>
      );
}
