import React from 'react';

interface FriendsHeaderProps {
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({ setErrMsg }) => {
  return (
    <div className="friends border">
      <header className="friends-header">
        <h1 className="friends__title">
          <span className="friends__title--top">Friends</span>
          <span className="friends__title--bottom">Pannel</span>
        </h1>
      </header>
    </div>
  );
};

export default FriendsHeader;
