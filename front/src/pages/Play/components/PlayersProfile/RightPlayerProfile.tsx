import React from 'react';
import { MDBCard } from 'mdb-react-ui-kit';
import { UserData } from 'services/User/User';

interface RightPlayerProfileProps {
  player2Data: UserData | null;
}

const RightPlayerProfile: React.FC<RightPlayerProfileProps> = ({ player2Data }) => {

  return (
    <MDBCard className="profile-game-card-r">
      <article className='player-profile-information-r'>
        <section className="player-profile-name" title={player2Data?.username ? player2Data?.username : ""}>
          {player2Data?.username}
          </section>
        <section className="player-profile-level">
          Level: {player2Data?.userLevel}
          </section>
        <section className="player-profile-points">
          Points: {player2Data?.userPoints}
          </section>
      </article>
      {player2Data?.profilePicture ? (
        <div className="profile-picture">
          <img src={player2Data?.profilePicture} alt="User Profile" />
        </div>
      ) : (<div></div>)}
    </MDBCard>
  );
}

export default RightPlayerProfile;