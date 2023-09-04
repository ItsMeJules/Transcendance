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
  type?: ProfileType;
  onAddFriend?: () => void;
  fetchUserProfile?: () => void;
  isFriend?: boolean;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, type = 'user', onAddFriend, fetchUserProfile, isFriend }) => {
  return (
    <MDBCard className="profile-board-card">

      <ProfileHeader type={type} isFriend={isFriend} onAddFriend={onAddFriend} />

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
          <ImageChange fetchUserProfile={fetchUserProfile!} />
          <EditUserFormValidation userData={userData} />
        </>
      )}
    </MDBCard>
  );
};

export default ProfileCard;
