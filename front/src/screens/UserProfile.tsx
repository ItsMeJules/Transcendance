import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import { UserData } from "../services/user";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import useLogout from "../hooks/useLogout";

export const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const userInstance = User.getInstance().getAxiosInstance();
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
    const logout = useLogout();
    const [value, setValue] = useState<number | null>(null);




    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(API_ROUTES.USER_PROFILE, {
                headers: {
                    'Authorization': `Bearer ${User.getInstance().getAccessToken()}`
                }
            });
            const userData = response.data;
            localStorage.setItem('userData', JSON.stringify(userData));
            setUserData(userData);
            User.getInstance().setUserFromResponseData(userData);
            console.log(User.getInstance().getData());
        } catch (err: any) {
            console.log("Error:" + err.response.data.message);
        }
    };

    useEffect(() => {
        // Check if user data exists in localStorage
        // const storedData = localStorage.getItem('userData');
        // if (storedData) {
        //     const userData = JSON.parse(storedData);
        //     setUserData(userData);
        //     User.getInstance().setUserFromResponseData(userData);
        //     console.log(User.getInstance().getData());
        //     console.log(User.getInstance().getProfilePicture());
        // } else {
        // If no user data in localStorage, fetch it from the server

        // const progressBar = document.getElementById('progress-bar');

        // if (progressBar) {
        //     const percentage = (1 / 10) * 100;
        //     progressBar.style.backgroundPosition = `${percentage}% 100%`;
        // }


        

        fetchUserProfile();
    }, []);

    const getCurrentDimension = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    const [screenSize, setScreenSize] = useState(getCurrentDimension());

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);

        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])

    return (
        <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
            <MDBContainer
                className="py-5"
                style={{ width: isSmallScreen ? '90%' : '60%', maxWidth: '500px', minWidth: '400px' }}>

                <MDBCard className="flex" style={{ borderRadius: '15px' }}>

                    <div className="d-flex align-items-center mr-2 ml-3 mt-2" style={{ justifyContent: "space-between" }}>
                        <Link title="Edit profile" to={APP_ROUTES.USER_PROFILE_EDIT} style={{ padding: '0px' }}>
                            <MDBCardImage src='/images/edit_profile.png' fluid style={{ width: '30px' }} />
                        </Link>
                        <button title="Log out" onClick={logout}>
                            <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
                        </button>
                    </div>

                    <div className="d-flex justify-content-center">
                        {User.getInstance().getProfilePicture() ? (
                            <div className="profile-picture-container">

                                <img src={User.getInstance().getProfilePicture()} alt="Profile" />

                            </div>
                        ) : (
                            <div className="empty-profile-picture-container">
                                <span style={{ fontSize: '1rem' }}>No profile picture</span>
                            </div>
                        )}
                    </div>

                    <div className="fade-line" style={{ marginTop: '20px' }}></div>

                    <div className="d-flex flex-grow-2">
                        <MDBCardBody className="text-left d-flex flex-column" style={{ width: '20%', minWidth: '140px' }}>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '0px' }}>
                                <MDBTypography tag="h5" style={{ minWidth: '100px' }}>Email</MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>
                                <MDBTypography tag="h5" style={{ minWidth: '100px' }}>Username</MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>
                                <MDBTypography tag="h5" style={{ minWidth: '100px' }}>First name</MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>
                                <MDBTypography tag="h5" style={{ minWidth: '100px' }}>Last name</MDBTypography>
                            </div>
                        </MDBCardBody>

                        <MDBCardBody className="text-left" style={{ minWidth: '0px', marginTop: '3px' }}>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography
                                    tag="h5"
                                    style={{
                                        width: '100%',
                                        minWidth: '0px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={User.getInstance().getData()?.email}>
                                    {User.getInstance().getData()?.email}
                                </MDBTypography>
                            </div>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography
                                    tag="h5"
                                    style={{
                                        marginTop: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={User.getInstance().getData()?.userName}>
                                    {User.getInstance().getData()?.userName}
                                </MDBTypography>
                            </div>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography
                                    tag="h5"
                                    style={{
                                        marginTop: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={User.getInstance().getData()?.firstName}>
                                    {User.getInstance().getData()?.firstName}
                                </MDBTypography>
                            </div>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography
                                    tag="h5"
                                    style={{
                                        marginTop: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={User.getInstance().getData()?.lastName}>
                                    {User.getInstance().getData()?.lastName}
                                </MDBTypography>
                            </div>
                        </MDBCardBody>
                    </div>

                    <div className="fade-line" style={{ marginTop: '-10px' }}></div>


                    <div className="flex text-center mt-3">
                        <div className="justify-center" style={{ width: '100%' }}>
                            <MDBCardText className="mb-1 h5">
                                {User.getInstance().getGamesPlayed()}
                            </MDBCardText>
                            <MDBCardText className="small text-muted mb-0">
                                Games played
                            </MDBCardText>
                        </div>

                        <div className="justify-center" style={{ width: '100%' }}>
                            <MDBCardText className="mb-1 h5">
                                {User.getInstance().getGamesWon()}
                            </MDBCardText>
                            <MDBCardText className="small text-muted mb-0">
                                Games won
                            </MDBCardText>
                        </div>
                    </div>
                    <div className="flex text-center mt-4 mb-4">
                        <div className="justify-center" style={{ width: '100%' }}>
                            <MDBCardText className="mb-1 h5">
                                {User.getInstance().getUserPoints()}
                            </MDBCardText>
                            <MDBCardText className="small text-muted mb-0">
                                Points won
                            </MDBCardText>
                        </div>

                        <div className="justify-center" style={{ width: '100%' }}>
                            
                            <div className="progress-container">

                                <div 
                                className="progress-bar"
                                id="progress-bar"
                                style={{height:'28px'}}></div>
                            </div>

                            <MDBCardText className="small text-muted mb-0">
                                Level {User.getInstance().getUserLevel()}
                            </MDBCardText>

                        </div>

                    </div>
                </MDBCard>
            </MDBContainer>
        </div>
    );

}