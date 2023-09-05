import React, { } from 'react';
import { MDBCardText } from 'mdb-react-ui-kit';
import { UserData } from 'services/User/User';
import getProgressBarClass from 'utils/progressBar/ProgressBar';

interface DisplayStatsProps {
  userData: UserData | null,
}

const DisplayStats: React.FC<DisplayStatsProps> = ({ userData }) => {
  const progressBarClass = getProgressBarClass(userData?.userLevel);

  return (
    <>
      <section className="stats-first-container">

        <div className="stats-first-sub-container">
          <MDBCardText className="mb-1 h5">
            {userData?.gamesPlayed}
          </MDBCardText>
          <MDBCardText className="small text-muted mb-0 custom-text-color">
            Games played
          </MDBCardText>
        </div>

        <div className="stats-first-sub-container custom-text-color">
          <MDBCardText className="mb-1 h5">
            {userData?.gamesWon}
          </MDBCardText>
          <MDBCardText className="small text-muted mb-0 custom-text-color">
            Games won
          </MDBCardText>
        </div>

      </section>

      <section className="stats-second-container">

        <div className="stats-second-sub-container">
          <MDBCardText className="mb-1 h5">
            {userData?.userPoints}
          </MDBCardText>
          <MDBCardText className="small text-muted mb-0 custom-text-color">
            Points won
          </MDBCardText>
        </div>

        <div className="stats-second-sub-container">
          <div className={`progress-bar ${progressBarClass}`}></div>
          <MDBCardText className="small mt-0.5 text-muted mb-0 custom-text-color"> 
            Level {userData?.userLevel}
          </MDBCardText>
        </div>

      </section>
    </>
  );
}

export default DisplayStats;
