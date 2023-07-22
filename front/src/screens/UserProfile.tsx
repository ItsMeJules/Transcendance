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
import useLogout from "../hooks/useLogout";

export const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const userInstance = User.getInstance().getAxiosInstance();
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
    const logout = useLogout();


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
            <MDBContainer className="py-5" style={{ width: isSmallScreen ? '90%' : '60%', maxWidth: '500px' }}>
                <MDBCard className="flex" style={{ borderRadius: '15px' }}>
                    <div className="d-flex align-items-center mt-2 ml-1 mr-1 border" style={{ justifyContent: "space-between" }}>
                        <Link className="border" to={APP_ROUTES.USER_PROFILE_EDIT}>
                            <MDBCardImage src='/images/edit_profile.png' fluid style={{ width: '30px' }} />
                        </Link>
                        <button onClick={logout}>
                            <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
                        </button>
                    </div>

                    <div className=" d-flex justify-content-center">
                        <div className="d-flex justify-content-center">
                            <MDBCardImage src='/images/logo.png' className="rounded-circle" fluid style={{ width: '100px' }} />
                        </div>
                    </div>

                    <div className="d-flex flex-grow-2">
                        <MDBCardBody className="text-left d-flex flex-column" style={{ width: '30%' }}>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '0px' }}>
                                <MDBTypography tag="h5" className="custooltip required "
                                    style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}
                                    data-tooltip="Required">
                                    Email
                                </MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>                                <MDBTypography tag="h4"
                                style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}>
                                Username
                            </MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>                                <MDBTypography tag="h4"
                                style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}>
                                First name
                            </MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>                                <MDBTypography tag="h4"
                                style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}>
                                Last name
                            </MDBTypography>
                            </div>
                        </MDBCardBody>
                        <MDBCardBody className="text-left" style={{ minWidth: '0px', marginTop:'3px' }}>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography tag="h5" style={{ width: '100%', minWidth: '0px' }}>{User.getInstance().getData()?.email} </MDBTypography>
                            </div>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography tag="h5" style={{ marginTop: '15px' }}>{User.getInstance().getData()?.userName}</MDBTypography>
                            </div>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography tag="h5" style={{ marginTop: '15px' }}>{User.getInstance().getData()?.firstName}</MDBTypography>
                            </div>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography tag="h5" style={{ marginTop: '15px' }}>{User.getInstance().getData()?.lastName}</MDBTypography>
                            </div>
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
            </MDBContainer>
        </div>
    );

}