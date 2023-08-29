import React from 'react';
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';

interface FriendsContainerProps {
  children: React.ReactNode;
}

const FriendsContainer: React.FC<FriendsContainerProps> = ({ children }) => {
  return (
    <MDBContainer className="friends-container">
      {children}
    </MDBContainer>
  );
};

export default FriendsContainer;