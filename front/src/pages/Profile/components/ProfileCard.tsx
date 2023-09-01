import React from 'react';
import { MDBCard } from 'mdb-react-ui-kit';
import ProfileHeader from './ProfileHeader';
import UserProfileContent from './UserProfileContent';
import { UserData } from "../../../services/User/User";
import ImageChange from "./ImageChange";
import EditUserFormValidation from "./EditUserFormValidation";
import ProfilePicContainer from './ProfilePicContainer';
import DisplayData from './DisplayData';
import DisplayStats from './DisplayStats';
import FadeLine from './FadeLine';
import QrCode from '../QrCode';

type ProfileType = 'user' | 'generic' | 'edit';

type ProfileCardProps = {
  userData: UserData | null;
  setErrMsg: (msg: string) => void;
  type?: ProfileType;
  iconColor?: string;
  onAddFriend?: () => void;
  fetchUserProfile?: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, setErrMsg, type = 'user', iconColor, onAddFriend, fetchUserProfile }) => {
  return (
    <MDBCard className="profile-board-card">

      <ProfileHeader setErrMsg={setErrMsg} type={type} iconColor={iconColor} onAddFriend={onAddFriend} />

      {type != 'edit' && (
        <>
          <ProfilePicContainer userData={userData} />
          <FadeLine marginTop='20px' />
          <DisplayData userData={userData} />
          <FadeLine marginTop='-10px' />
          <DisplayStats userData={userData} />
          <QrCode />
        </>
      )}

      {type == 'edit' && (
        <>
          <ProfilePicContainer userData={userData} />
          <ImageChange setErrMsg={setErrMsg} fetchUserProfile={fetchUserProfile!} />
          <div className="fade-line-black" style={{ marginTop: '20px' }}></div>
          <EditUserFormValidation setErrMsg={setErrMsg} userData={userData} />
        </>
      )}
    </MDBCard>
  );
};

export default ProfileCard;
