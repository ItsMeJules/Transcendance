import React from 'react';
import LogoutParent from "../../../layout/LogoutButton/LogoutParent";

interface LeaderboardHeaderProps {
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({ setErrMsg }) => {
  return (
    <div className="leaderboard">
      <header className="leaderboard-header">
        <LogoutParent setErrMsg={setErrMsg} />
        <h1 className="leaderboard__title">
          <span className="leaderboard__title--top">
            Transcendance
          </span>
          <span className="leaderboard__title--bottom">
            Leaderboard
          </span>
        </h1>
      </header>
    </div>
  );
};

export default LeaderboardHeader;
