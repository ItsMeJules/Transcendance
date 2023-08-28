import React from 'react';
import { MDBCard } from 'mdb-react-ui-kit';
import { UserData } from 'services/User/User';

interface LeftPlayerProfileProps {
  player1Data: UserData | null;
}

const LeftPlayerProfile: React.FC<LeftPlayerProfileProps> = ({ player1Data }) => {

  return (
    <MDBCard className="profile-game-card-l">
      {player1Data?.profilePicture ? (
        <div className="profile-picture">
          <img src={player1Data?.profilePicture} alt="User Profile" />
        </div>
      ) : (<div></div>)}
      <article className='player-profile-information-l'>
        <section className="player-profile-name" title={player1Data?.username ? player1Data?.username : ""}>
          {player1Data?.username}
        </section>
        <section className="player-profile-level">
          Level: {player1Data?.userLevel}
        </section>
        <section className="player-profile-points">
          Points: {player1Data?.userPoints}
        </section>
      </article>
    </MDBCard>
  );
}

export default LeftPlayerProfile;