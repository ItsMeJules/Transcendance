import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import { UserData } from "../services/user";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const userInstance = User.getInstance().getAxiosInstance();
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });


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
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            setUserData(userData);
            User.getInstance().setUserFromResponseData(userData);
            console.log(User.getInstance().getData());
        } else {
            // If no user data in localStorage, fetch it from the server
            fetchUserProfile();
        }
    }, []);

    return (
        <div className="vh-100" style={{ width: '100%', height: '100%' }}>
            <MDBContainer className="container py-5" style={{marginTop: '100px'}}>
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol md="12" xl="4" style={{ borderRadius: '15px', width: isSmallScreen ? '60%' : '40%', minWidth: '400px'}}>
                        <MDBCard style={{ borderRadius: '15px', height: '100%' , width: isSmallScreen ? '60%' : '100%', minWidth: '400px'}}>
                            <div className="d-flex align-items-center mt-2 ml-2">
                                <Link to={APP_ROUTES.USER_PROFILE_EDIT}>
                                    <MDBCardImage src='/images/edit_profile.png' fluid style={{ width: '30px' }} />
                                </Link>
                            </div>
                            <div className="border d-flex justify-content-center">
                                <div className="d-flex justify-content-center">
                                    <MDBCardImage src='/images/logo.png' className="rounded-circle" fluid style={{ width: '100px' }} />
                                </div>
                            </div>
                            <div className="d-flex flex-grow-1">
                                <MDBCardBody className="text-left">
                                    <MDBTypography tag="h4">email:</MDBTypography>
                                    <MDBTypography tag="h4" style={{ marginTop: '15px' }}>Username:</MDBTypography>
                                    <MDBTypography tag="h4" style={{ marginTop: '15px' }}>First name:</MDBTypography>
                                    <MDBTypography tag="h4" style={{ marginTop: '5px' }}>Last name:</MDBTypography>
                                </MDBCardBody>
                                <MDBCardBody className="text-left">
                                    <MDBTypography tag="h4">{User.getInstance().getData()?.email} </MDBTypography>
                                    <MDBTypography tag="h4" style={{ marginTop: '15px' }}>{User.getInstance().getData()?.userName}</MDBTypography>
                                    <MDBTypography tag="h4" style={{ marginTop: '15px' }}>{User.getInstance().getData()?.userName}</MDBTypography>
                                    <MDBTypography tag="h4" style={{ marginTop: '5px' }}>{User.getInstance().getData()?.userName}</MDBTypography>
                                </MDBCardBody>
                            </div>
                            <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                <div>
                                    <MDBCardText className="mb-1 h5">8471</MDBCardText>
                                    <MDBCardText className="small text-muted mb-0">Wallets Balance</MDBCardText>
                                </div>
                                <div className="px-3">
                                    <MDBCardText className="mb-1 h5">8512</MDBCardText>
                                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                                </div>
                                <div>
                                    <MDBCardText className="mb-1 h5">4751</MDBCardText>
                                    <MDBCardText className="small text-muted mb-0">Total Transactions</MDBCardText>
                                </div>
                            </div>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );

}