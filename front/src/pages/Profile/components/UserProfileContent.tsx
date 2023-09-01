import React from 'react';
import ProfilePicContainer from "./ProfilePicContainer";
import DisplayData from "./DisplayData";
import DisplayStats from "./DisplayStats";
import QrCode from '../QrCode';
import { UserData } from "services/User/User";

type UserProfileContentProps = {
  userData: UserData | null;
};

const UserProfileContent: React.FC<UserProfileContentProps> = ({ userData }) => {
  return (
    <React.Fragment>
      <ProfilePicContainer userData={userData} />
      <DisplayData userData={userData} />
      <DisplayStats userData={userData} />
      <QrCode />
    </React.Fragment>
  );
};

export default UserProfileContent;
