import React, { useEffect, useState } from "react"
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { Link } from "react-router-dom";
import axios from "axios";
import { UserData } from "../services/user";
import User from "../services/user";


export const Test = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profilePicture, setProfilePicture] = useState('');

    const fetchProfilePicture = async () => {
        try {
            console.log("1:", User.getInstance().getAccessToken());
            const response = await axios.get('http://localhost:3000/users/get-profile-picture', {
                headers: {
                    'Authorization': `Bearer ${User.getInstance().getAccessToken()}`
                }
            });
            // const userData = response.data;
            // localStorage.setItem('userData', JSON.stringify(userData));
            // setUserData(userData);
            // User.getInstance().setUserFromResponseData(userData);
            // console.log(User.getInstance().getData());
            console.log("2:", response.data);
            setProfilePicture(response.data);
        } catch (err: any) {
            console.log("Error:" + err.response.data.message);
        }
    }

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            setUserData(userData);
            User.getInstance().setUserFromResponseData(userData);
            console.log(User.getInstance().getData());
        } else {
            // If no user data in localStorage, fetch it from the server
            // fetchUserProfile();
        }
        fetchProfilePicture();
    }, []);

    return (
        <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
            <MDBContainer className="py-5" style={{ maxWidth: '500px', minWidth: '400px' }}>
                <MDBCard className="flex" style={{ borderRadius: '15px' }}>
                    <div className="d-flex align-items-center mt-2 ml-1 mr-1 border" style={{ justifyContent: "space-between" }}>
                        <button>
                            <MDBCardImage src={profilePicture} fluid style={{ width: '34px' }} />
                        </button>
                    </div>

                    <div className=" d-flex justify-content-center">
                        <div className="d-flex justify-content-center">
                            <MDBCardImage src={profilePicture} className="rounded-circle" fluid style={{ width: '100px' }} />
                        </div>
                    </div>

                    <div className="d-flex flex-grow-2">
                        <MDBCardBody className="text-left d-flex flex-column" style={{ width: '20%' }}>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '0px' }}>
                                <MDBTypography tag="h5" className="custooltip required " data-tooltip="Required">
                                    Email
                                </MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>
                                <MDBTypography tag="h5">
                                    Username
                                </MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>
                                <MDBTypography tag="h5">
                                    First name
                                </MDBTypography>
                            </div>
                            <div className="align-items-center d-flex" style={{ height: '35px', marginTop: '15px' }}>
                                <MDBTypography tag="h5">
                                    Last name
                                </MDBTypography>
                            </div>
                        </MDBCardBody>
                        <MDBCardBody className="text-left" style={{ minWidth: '0px', marginTop: '3px' }}>
                            <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                <MDBTypography tag="h5" style={{ width: '100%', minWidth: '0px' }}>TEST </MDBTypography>
                            </div>
                        </MDBCardBody>
                    </div>
                </MDBCard>
            </MDBContainer>
        </div>
    )
}