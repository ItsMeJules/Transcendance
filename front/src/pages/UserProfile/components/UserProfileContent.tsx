import React from 'react';
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../utils/constants";
import { MDBCardImage } from 'mdb-react-ui-kit';
import ProfilePicContainer from "./ProfilePicContainer";
import DisplayData from "./DisplayData";
import DisplayStats from "./DisplayStats";
import FadeLine from './FadeLine';
import { UserData } from "../../../services/User";

type UserProfileContentProps = {
    userData: UserData | null;
};

const UserProfileContent: React.FC<UserProfileContentProps> = ({ userData }) => {
    return (
        <React.Fragment>
            <ProfilePicContainer userData={userData} />
            <FadeLine marginTop='20px' />
            <DisplayData userData={userData} />
            <FadeLine marginTop='-10px' />
            <DisplayStats userData={userData} />
        </React.Fragment>
    );
};

export default UserProfileContent;
