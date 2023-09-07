import React from 'react';
import ProfileHeader from './ProfileHeader';
import { UserData } from "services/User/User";
import ImageChange from "./ImageChange";
import EditUserFormValidation from "./EditUserFormValidation";
import ProfilePicContainer from './ProfilePicContainer';
import DisplayData from './DisplayData';

type ProfileType = 'user' | 'generic' | 'edit';

type ProfileCardProps = {
  userData: UserData | null;
  type?: ProfileType;
  onAddFriend?: () => void;
  fetchUserProfile?: () => void;
  isFriend?: boolean;
  blockUser?: () => void;
  isBlocked?: boolean;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, type = 'user', onAddFriend, fetchUserProfile, isFriend, blockUser, isBlocked }) => {

  return (
    <div className="profile-board-container">

      <ProfileHeader userData={userData} type={type} isFriend={isFriend} onAddFriend={onAddFriend} blockUser={blockUser} isBlocked={isBlocked} />

      {type !== 'edit' && (
        <>
          <ProfilePicContainer userData={userData} />
          <DisplayData userData={userData} />
        </>
      )}

      {type === 'edit' && (
        <>
          <ProfilePicContainer userData={userData} />
          <ImageChange fetchUserProfile={fetchUserProfile!} />
          <EditUserFormValidation userData={userData} />
        </>
      )}
    </div>
  );
};

export default ProfileCard;
