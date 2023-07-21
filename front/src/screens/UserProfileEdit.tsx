import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import { UserData } from "../services/user";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export const UserProfileEdit: React.FC = () => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

    const userEmail = User.getInstance().getEmail();
    const isEmailEmpty = userEmail === "";


    return (
        <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
            <MDBContainer className="py-5" style={{ width: isSmallScreen ? '90%' : '60%', maxWidth: '500px' }}>
                <MDBCard className="flex" style={{ borderRadius: '15px' }}>
                    <div className=" d-flex justify-content-center">
                        <div className="d-flex justify-content-center">
                            <MDBCardImage src='/images/logo.png' className="rounded-circle" fluid style={{ width: '100px' }} />
                        </div>
                    </div>
                    <div className="d-flex flex-grow-2 ">
                        <MDBCardBody className="text-left border d-flex flex-column">
                            <div className="border align-items-center d-flex" style={{ height: '35px', marginTop: '0px'}}>
                                <MDBTypography tag="h5"
                                    style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002}}>
                                    Email
                                </MDBTypography>
                            </div>
                            <div className="border align-items-center d-flex" style={{ height: '35px', marginTop: '15px'}}>                                <MDBTypography tag="h4"
                                    style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}>
                                    Username
                                </MDBTypography>
                            </div>
                            <div className="border align-items-center d-flex" style={{ height: '35px', marginTop: '15px'}}>                                <MDBTypography tag="h4"
                                    style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}>
                                    First name
                                </MDBTypography>
                            </div>
                            <div className="border align-items-center d-flex" style={{ height: '35px', marginTop: '15px'}}>                                <MDBTypography tag="h4"
                                    style={{ fontSize: screenSize.width > 500 ? 20 : 20 * screenSize.width * 0.002 }}>
                                    Last name
                                </MDBTypography>
                            </div>
                        </MDBCardBody>
                        <MDBCardBody className="text-left" style={{ minWidth: '0px' }}>
                            <form action="POST" className="">
                                <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                    <input type="email"
                                        autoComplete="off"
                                        placeholder={User.getInstance().getEmail()}
                                        id="emailaddress"
                                        value={email}
                                        className="border text-black input-field edit-form-label"
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="border" style={{ height: '35px', minWidth: '0px', marginTop: '15px'}}>
                                    <input type="email"
                                        autoComplete="off"
                                        placeholder="youremail@email.com"
                                        id="emailaddress"
                                        value={email}
                                        className="border text-black input-field edit-form-label"
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="border" style={{ height: '35px', minWidth: '0px', marginTop: '15px'}}>
                                    <input type="email"
                                        autoComplete="off"
                                        placeholder="youremail@email.com"
                                        id="emailaddress"
                                        value={email}
                                        className="border text-black input-field edit-form-label"
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="border" style={{ height: '35px', minWidth: '0px', marginTop: '15px'}}>
                                    <input type="email"
                                        autoComplete="off"
                                        placeholder="youremail@email.com"
                                        id="emailaddress"
                                        value={email}
                                        className="border text-black input-field edit-form-label"
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                {/* <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                    <input type="email"
                                        autoComplete="off"
                                        placeholder="youremail@email.com"
                                        id="emailaddress"
                                        value={email}
                                        className="border text-black input-field edit-form-label"
                                        style={{ width: '100%', minWidth: '0px', marginTop: '15px' }}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                    <input type="email"
                                        autoComplete="off"
                                        placeholder="youremail@email.com"
                                        id="emailaddress"
                                        value={email}
                                        className="border text-black input-field edit-form-label"
                                        style={{ width: '100%', minWidth: '0px', marginTop: '15px' }}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div> */}

                            </form>
                        </MDBCardBody>
                    </div>

                    <div className="d-flex justify-center">
                        <button className="save-changes-button" style={{ marginTop: '10px' }}>
                            Save changes
                        </button>
                    </div>
                </MDBCard>
            </MDBContainer>
        </div>
    );

}




// return (
//     <div className="vh-100 d-flex " style={{ paddingTop: '100px' }}>
//         <MDBContainer className="py-5" style={{ width: isSmallScreen ? '90%' : '60%', maxWidth: '500px' }}>
//             <MDBCard className="flex" style={{ borderRadius: '15px' }}>
//                 <div className="d-flex align-items-center mt-2 ml-2 ">
//                     <Link to={APP_ROUTES.USER_PROFILE_EDIT}>
//                         <MDBCardImage src='/images/edit_profile.png' fluid style={{ width: '30px' }} />
//                     </Link>
//                 </div>
//                 <div className=" d-flex justify-content-center">
//                     <div className="d-flex justify-content-center">
//                         <MDBCardImage src='/images/logo.png' className="rounded-circle" fluid style={{ width: '100px' }} />
//                     </div>
//                 </div>
//                 <div className="d-flex flex-grow-1">
//                     <MDBCardBody className="text-left ">
//                         <div style={{ height: '35px', marginTop: '0px' }}>
//                             <MDBTypography tag="h4">email</MDBTypography>
//                         </div>
//                         <div className="" style={{ height: '35px' }}>
//                             <MDBTypography tag="h4" style={{ marginTop: '15px' }}>Username</MDBTypography>
//                         </div>
//                         <div className="" style={{ height: '35px' }}>
//                             <MDBTypography tag="h4" style={{ marginTop: '15px' }}>First name</MDBTypography>
//                         </div>
//                         <div className="" style={{ height: '35px' }}>
//                             <MDBTypography tag="h4" style={{ marginTop: '15px' }}>Last name</MDBTypography>
//                         </div>
//                     </MDBCardBody>
//                     <MDBCardBody className="text-left">
//                         <form action="POST">
//                             <div style={{ height: '35px' }}>
//                                 <input type="email"
//                                     autoComplete="off"
//                                     placeholder="youremail@email.com"
//                                     id="emailaddress"
//                                     value={email}
//                                     className="border input-field edit-form-label text-black "
//                                     style={{ marginTop: 'px', }}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required />
//                             </div>
//                             <div style={{ height: '35px' }}>
//                                 <input type="text"
//                                     autoComplete="off"
//                                     placeholder="Username"
//                                     id="userName"
//                                     value={userName}
//                                     className="border input-field edit-form-label flex text-black "
//                                     style={{ marginTop: '15px' }}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required />
//                             </div>
//                             <div style={{ height: '35px' }}>
//                                 <input type="text"
//                                     autoComplete="off"
//                                     placeholder="First Name"
//                                     id="firstName"
//                                     value={firstName}
//                                     className="border input-field edit-form-label flex text-black "
//                                     style={{ marginTop: '15px' }}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required />
//                             </div>

//                             <div style={{ height: '35px' }}>
//                                 <input type="text"
//                                     autoComplete="off"
//                                     placeholder="Last Name"
//                                     id="lastName"
//                                     value={userName}
//                                     className="border input-field edit-form-label flex text-black "
//                                     style={{ marginTop: '15px' }}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required />
//                             </div>

//                         </form>
//                     </MDBCardBody>
//                 </div>

//                 <div className="d-flex justify-center">
//                     <button className="save-changes-button" style={{ marginTop: '10px' }}>
//                         Save changes
//                     </button>
//                 </div>

//                 <div className="d-flex justify-content-between text-center mt-5 mb-2">
//                 </div>
//             </MDBCard>
//         </MDBContainer>
//     </div>
// );