import React from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';

type UserProfileContainerProps = {
    children: React.ReactNode;  // To allow any child components
};

const UserProfileContainer: React.FC<UserProfileContainerProps> = ({ children }) => {
    return (
        <div className="vh-100">
            <MDBContainer className="profile-board-container">
                {children}
            </MDBContainer>
        </div>
    );
};

export default UserProfileContainer;