import React from 'react';
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../utils/routing";
import { MDBCardImage } from 'mdb-react-ui-kit';
import LogoutParent from "../../../layout/LogoutButton/LogoutParent";
import { IconContext } from 'react-icons';
import { FaHeart } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa6';
import { FaUserPen } from 'react-icons/fa6';

type ProfileType = 'user' | 'generic' | 'edit';

type ProfileHeaderProps = {
    setErrMsg: (message: string) => void;
    type: ProfileType;
    iconColor?: string;
    onAddFriend?: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ setErrMsg, type, iconColor, onAddFriend }) => {
    return (
        <div className="profile-board-header-show-profile">
            {type === 'user' && (
                <Link title="Edit profile" to={APP_ROUTES.USER_PROFILE_EDIT} style={{ padding: '0px' }}>
                  <IconContext.Provider value={{ color: iconColor || 'black', size: '36px' }}>
                    <FaUserPen />
                  </IconContext.Provider>
                </Link>
            )}

            {type === 'generic' && (
                <button onClick={onAddFriend}>
                    <IconContext.Provider value={{ color: iconColor || 'black', size: '30px' }}>
                        <FaHeart />
                    </IconContext.Provider>
                </button>
            )}

            {type === 'edit' && (
                <Link title="Back to profile" to={APP_ROUTES.USER_PROFILE} style={{ padding: '0px' }}>
                  <IconContext.Provider value={{ color: iconColor || 'black', size: '30px' }}>
                    <FaUser />
                  </IconContext.Provider>
                </Link>
            )}

            <LogoutParent setErrMsg={setErrMsg} />
        </div>
    );
};

export default ProfileHeader;
