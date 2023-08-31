import React from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';

type UserProfileContainerProps = {
  children: React.ReactNode;  // To allow any child components
};

const UserProfileContainer: React.FC<UserProfileContainerProps> = ({ children }) => {
  return (
    <MDBContainer className="profile-board-container">
      {children}
    </MDBContainer>
  );
};

export default UserProfileContainer;