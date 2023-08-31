import React from 'react';
import { MDBCard } from 'mdb-react-ui-kit';
import ProfileHeader from './ProfileHeader';
import UserProfileContent from './UserProfileContent';
import { UserData } from "../../../services/User/User";
import QrCode from '../QrCode';
import ImageChange from "./ImageChange";
import EditUserFormValidation from "./EditUserFormValidation";
import ProfilePicContainer from './ProfilePicContainer';

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
        <UserProfileContent userData={userData} />
      )}

      {type == 'edit' && (
        <>
          <ProfilePicContainer userData={userData} />
          <ImageChange setErrMsg={setErrMsg} fetchUserProfile={fetchUserProfile!} />
          <div className="fade-line-black" style={{ marginTop: '20px' }}></div>
          <EditUserFormValidation setErrMsg={setErrMsg} userData={userData} />
        </>
      )}

      {type === 'user' && <QrCode />}

    </MDBCard>
  );
};

export default ProfileCard;
