import React, { useEffect, useState } from "react";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { UserData } from "services/User/User";
import { useNavigate } from "react-router-dom";
import ToastError from "layout/ToastError/ToastError";
import ProfileCard from "pages/Profile/components/ProfileCard";

export const ProfileEdit: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const history = useNavigate();
  const customAxiosInstance = useAxios();

  const resetErrMsg = () => {
    setErrMsg('');
  };

  const fetchUserProfile = async () => {
    try {
      const response = await customAxiosInstance.get(API_ROUTES.USER_PROFILE,
        {
          withCredentials: true
        });
      const userData = response.data;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserData(userData);
      setUsername(userData.username);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    } catch (err: any) { }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <ProfileCard userData={userData} type="edit" fetchUserProfile={fetchUserProfile} />
    </>
  );
}

export default ProfileEdit;
