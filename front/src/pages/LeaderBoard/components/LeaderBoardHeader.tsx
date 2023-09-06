import React from 'react';

interface LeaderboardHeaderProps {
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({ setErrMsg }) => {
  return (
    <body className="leaderboard">
      <header className="leaderboard-header">
        <h1 className="leaderboard__title">
          <span className="leaderboard__title--top">
            Transcendance
          </span>
          <span className="leaderboard__title--bottom">
            Leaderboard
          </span>
        </h1>
      </header>
    </body>
  );
};

export default LeaderboardHeader;
