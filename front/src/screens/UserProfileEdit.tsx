import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Particle from "../components/Particle";
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import { UserData } from "../services/user";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import useLogout from "../hooks/useLogout";
import { Avatar, Button, Modal } from 'antd';

export const UserProfileEdit: React.FC = () => {
    const logout = useLogout();
    const userEmail = User.getInstance().getEmail();
    const isEmailEmpty = userEmail === "";
    const userUsername = User.getInstance().getUsername();
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(true);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const userFirstName = User.getInstance().getFirstName();
    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(true);
    const userLastName = User.getInstance().getLastName();
    const [isLastNameEmpty, setIsLastNameEmpty] = useState(true);
    const [errMsg, setErrMsg] = useState('');
    const [profilePic, setProfilePic] = useState(User.getInstance().getProfilePicture());
    const [email, setEmail] = useState('');
    const initialEmail = User.getInstance().getEmail();
    const [emailError, setEmailError] = useState('');
    const [username, setUsername] = useState(userUsername);
    const [firstName, setFirstName] = useState(userFirstName);
    const [lastName, setLastName] = useState(userLastName);
    const [userData, setUserData] = useState<UserData | null>(null);
    const userInstance = User.getInstance().getAxiosInstance();
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
    const history = useNavigate();

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(API_ROUTES.USER_PROFILE,
                {
                    withCredentials: true
                });
            const userData = response.data;
            localStorage.setItem('userData', JSON.stringify(userData));
            setUserData(userData);
            User.getInstance().setUserFromResponseData(userData);
            setEmail(User.getInstance().getEmail());
            setUsername(User.getInstance().getUsername());
            setFirstName(User.getInstance().getFirstName());
            setLastName(User.getInstance().getLastName());
            setProfilePic(User.getInstance().getProfilePicture());
        } catch (err: any) {
            console.log("Error:" + err.response.data.message);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const dataToSend: any = {};
        if (username) {
            dataToSend.username = username;
        }
        if (firstName) {
            dataToSend.firstName = firstName;
        }
        if (lastName) {
            dataToSend.lastName = lastName;
        }

        try {
            console.log("1 dataToSend:", dataToSend);

            const response = await axios.patch(
                API_ROUTES.USER_PROFILE_EDIT,
                dataToSend,
                {
                    withCredentials: true
                });
            const userData = response.data;
            localStorage.setItem('userData', JSON.stringify(userData));
            setUserData(userData);
            User.getInstance().setUserFromResponseData(userData);
            console.log(User.getInstance().getData());
            history(APP_ROUTES.USER_PROFILE);

        } catch (err: any) {
            console.log(err.response.data.message);
        }
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files?.[0];
        if (imageFile) {
            const formData = new FormData();
            formData.append("profilePicture", imageFile);
            console.log("OKKKKKK")
            try {
                await axios.post('http://localhost:3000/users/pf', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true, // Add this line to include the withCredentials option
                });
                fetchUserProfile();
            } catch (error) {
                console.error("Failed to upload profile picture:", error);
            }
        }
    };




    return (
        <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
            <MDBContainer className="py-5" style={{ width: isSmallScreen ? '90%' : '60%', maxWidth: '500px', minWidth: '400px' }}>
                <MDBCard className="flex" style={{ borderRadius: '15px' }}>

                    <div className="d-flex align-items-center mr-2 ml-3 mt-2" style={{ justifyContent: "right" }}>
                        <button title="Log out" onClick={logout}>
                            <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
                        </button>
                    </div>


                    <div className="d-flex justify-content-center">
                        {profilePic ? (
                            <div className="profile-picture-container">

                                <img src={profilePic} alt={profilePic} />

                            </div>
                        ) : (
                            <div className="empty-profile-picture-container">
                                <span style={{ fontSize: '1rem' }}>{profilePic}</span>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-center" style={{ marginTop: '10px' }}>
                        <label className="custom-file-input">
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            Upload Profile Picture
                        </label>
                    </div>

                    <div className="fade-line" style={{ marginTop: '20px' }}>

                    </div>

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

                        <MDBCardBody className="text-left" style={{ minWidth: '0px' }}>
                            <form action="POST" onSubmit={handleSubmit}>
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

                                <div className="" style={{ height: '35px', minWidth: '0px', marginTop: '5px' }}>
                                    <input type="text"
                                        autoComplete="off"
                                        placeholder="Enter username"
                                        id="username"
                                        value={username}
                                        className={`border ${isUsernameEmpty && !isInputFocused ? "placeholder-gray" : "placeholder-black"
                                            } input-field edit-form-label`}
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setUsername(e.target.value)} />
                                </div>

                                <div className="" style={{ height: '35px', minWidth: '0px', marginTop: '15px' }}>
                                    <input type="text"
                                        autoComplete="off"
                                        placeholder="Enter first name"
                                        id="firstname"
                                        value={firstName}
                                        className={`border ${isFirstNameEmpty && !isInputFocused ? "placeholder-gray" : "placeholder-black"
                                            } input-field edit-form-label`}
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setFirstName(e.target.value)} />
                                </div>

                                <div className="" style={{ height: '35px', minWidth: '0px', marginTop: '15px' }}>
                                    <input type="text"
                                        autoComplete="off"
                                        placeholder="Enter last name"
                                        id="lastname"
                                        value={lastName}
                                        className={`border ${isLastNameEmpty ? "placeholder-gray" : "placeholder-black"} input-field edit-form-label`}
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="d-flex justify-left" style={{ marginTop: '10px' }}>
                                    <button type="submit" className="save-changes-button" style={{ marginTop: '10px' }}>
                                        Save changes
                                    </button>
                                </div>
                            </form>

                        </MDBCardBody>
                    </div>

                    <div className="d-flex justify-content-between text-center mt-5 mb-2">
                    </div>
                </MDBCard>
            </MDBContainer>
        </div>
    );

}







// <div className="" style={{ height: '35px', minWidth: '0px' }}>
//                                     <input type="text"
//                                         autoComplete="off"
//                                         placeholder={User.getInstance().getEmail()}
//                                         id="emailaddress"
//                                         value={email}
//                                         className={`border ${isEmailEmpty ? "placeholder-gray" : "placeholder-black"
//                                             } input-field edit-form-label ${emailError ? "is-invalid" : ""}`}
//                                         style={{ width: '100%', minWidth: '0px' }}
//                                         onChange={(e) => {
//                                             const inputValue = e.target.value;
//                                             if (inputValue !== User.getInstance().getEmail()) {
//                                                 setEmail(inputValue);
//                                                 validateEmail(inputValue);
//                                             } else {
//                                                 setEmail(User.getInstance().getEmail());
//                                                 setEmailError("");
//                                             }
//                                         }}
//                                         aria-describedby="emailErrorText" // Add the aria-describedby attribute
//                                     />
//                                     {emailError && (
//                                         <div
//                                             className="invalid-feedback"
//                                             id="emailErrorText" // Set the id of the error message container
//                                         >
//                                             {emailError}
//                                         </div>
//                                     )}
//                                 </div>