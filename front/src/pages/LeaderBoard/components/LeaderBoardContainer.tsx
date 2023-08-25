import React from 'react';
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';

interface LeaderBoardContainerProps {
  children: React.ReactNode;
}

const LeaderBoardContainer: React.FC<LeaderBoardContainerProps> = ({ children }) => {
  return (
    <MDBContainer className="leaderboard-container">
      <MDBCard className="leaderboard-card">
        {children}
      </MDBCard>
    </MDBContainer>
  );
};

export default LeaderBoardContainer;