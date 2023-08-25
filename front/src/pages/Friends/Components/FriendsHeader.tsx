import React from 'react';
import LogoutParent from "../../../layout/LogoutButton/LogoutParent";

interface FriendsHeaderProps {
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({ setErrMsg }) => {
  return (
    <div className="friends">
      <header className="friends-header">
        <LogoutParent setErrMsg={setErrMsg} />
        <h1 className="friends__title">
          <span className="friends__title--top">Friends</span>
          <span className="friends__title--bottom">Pannel</span>
        </h1>
      </header>
    </div>
  );
};

export default FriendsHeader;
