import React from 'react';
import { MDBCard } from 'mdb-react-ui-kit';
import ProfileHeader from './ProfileHeader';
import { UserData } from "../../../services/User/User";
import ImageChange from "./ImageChange";
import EditUserFormValidation from "./EditUserFormValidation";
import ProfilePicContainer from './ProfilePicContainer';
import DisplayData from './DisplayData';
import DisplayStats from './DisplayStats';

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
          <DisplayData userData={userData} />
          <DisplayStats userData={userData} />
        </>
      )}

      {type == 'edit' && (
        <>
          <ProfilePicContainer userData={userData} />
          <ImageChange setErrMsg={setErrMsg} fetchUserProfile={fetchUserProfile!} />
          <EditUserFormValidation setErrMsg={setErrMsg} userData={userData} />
        </>
      )}
    </MDBCard>
  );
};

export default ProfileCard;
