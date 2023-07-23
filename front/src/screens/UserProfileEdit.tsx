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

    const [profilePic, setProfilePic] = useState<File | null>(null);

    const [email, setEmail] = useState('');
    const initialEmail = User.getInstance().getEmail();
    const [emailError, setEmailError] = useState('');
    const [userName, setUserName] = useState(userUsername);
    const [firstName, setFirstName] = useState(userFirstName);
    const [lastName, setLastName] = useState(userLastName);
    const [userData, setUserData] = useState<UserData | null>(null);
    const userInstance = User.getInstance().getAxiosInstance();
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
    const history = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        setIsInputFocused(false);
    };

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
            // console.log(User.getInstance().getData());
            setEmail(User.getInstance().getEmail());
            setUserName(User.getInstance().getUsername());
            setFirstName(User.getInstance().getFirstName());
            setLastName(User.getInstance().getLastName());
        } catch (err: any) {
            console.log("Error:" + err.response.data.message);
        }
    };

    useEffect(() => {
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

    const validateEmail = (email: string) => {
        // Simple regex pattern to check email format with domain validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            setEmailError("");
        }
        else if (!emailRegex.test(email)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const emailToSubmit = email || initialEmail;

        // console.log(userId, emailToSubmit, userName, firstName, lastName);
        validateEmail(emailToSubmit);
        if (emailError) {
            // If email is invalid, don't proceed with form submission
            console.log("email error");
            return;
        }
        const dataToSend: any = {};
        if (emailToSubmit) {
            dataToSend.email = emailToSubmit;
        }
        if (userName) {
            dataToSend.userName = userName;
        }
        if (firstName) {
            dataToSend.firstName = firstName;
        }
        if (lastName) {
            dataToSend.lastName = lastName;
        }

        try {
            // const data = JSON.stringify({ email: emailToSubmit });

            console.log("1 dataToSend:", dataToSend);

            const response = await axios.patch(
                API_ROUTES.USER_PROFILE_EDIT,
                dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${User.getInstance().getAccessToken()}`
                    }
                });
            const userData = response.data;
            localStorage.setItem('userData', JSON.stringify(userData));
            setUserData(userData);
            User.getInstance().setUserFromResponseData(userData);
            console.log(User.getInstance().getData());
            history(APP_ROUTES.USER_PROFILE);

        } catch (err: any) {
            console.log(err.response.data.message);
            // if (!err?.response) {
            //     setErrMsg('No Server Response');
            // } else if (err.response?.status === 400) {
            //     setErrMsg('Missing email or password');
            // } else if (err.response?.status === 401) {
            //     setErrMsg('Unauthorized');
            // } else {
            //     setErrMsg('Login failed');
            // }
            // errRef.current?.focus();
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setProfilePic(file);
        }
      };

      const uploadProfilePic = async () => {
        if (profilePic) {
          const formData = new FormData();
          formData.append("profilePicture", profilePic);
          
          try {
            await axios.post('http://localhost:3333/users/pf', formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${User.getInstance().getAccessToken()}`,
              },
            });
      
            // Profile picture uploaded successfully
            // You may want to update the user's profile picture URL in the state or fetch the updated user data from the server
          } catch (error) {
            // Handle error if the upload fails
            console.error("Failed to upload profile picture:", error);
          }
        }
      };

    return (
        <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
            <MDBContainer className="py-5" style={{ width: isSmallScreen ? '90%' : '60%', maxWidth: '500px' }}>
                <MDBCard className="flex" style={{ borderRadius: '15px' }}>

                    <div className="d-flex align-items-center mt-2 ml-1 mr-1 border" style={{ justifyContent: "right" }}>
                        <button onClick={logout}>
                            <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
                        </button>
                    </div>
                    <div className=" d-flex justify-content-center">
                        <div className="d-flex justify-content-center">
                            <MDBCardImage src='/images/logo.png' className="rounded-circle" fluid style={{ width: '100px' }} />
                        </div>
                    </div>
                    <div className=" d-flex justify-content-center">
                        <div className="d-flex justify-content-center">
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            <button onClick={uploadProfilePic}>Upload Profile Picture</button>
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
                        <MDBCardBody className="text-left" style={{ minWidth: '0px' }}>
                            <form action="POST" onSubmit={handleSubmit}>
                                <div className="" style={{ height: '35px', minWidth: '0px' }}>
                                    <input type="text"
                                        autoComplete="off"
                                        placeholder={User.getInstance().getEmail()}
                                        id="emailaddress"
                                        value={email}
                                        className={`border ${isEmailEmpty ? "placeholder-gray" : "placeholder-black"
                                            } input-field edit-form-label ${emailError ? "is-invalid" : ""}`}
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue !== User.getInstance().getEmail()) {
                                                setEmail(inputValue);
                                                validateEmail(inputValue);
                                            } else {
                                                setEmail(User.getInstance().getEmail());
                                                setEmailError("");
                                            }
                                        }}
                                        aria-describedby="emailErrorText" // Add the aria-describedby attribute
                                    />
                                    {emailError && (
                                        <div
                                            className="invalid-feedback"
                                            id="emailErrorText" // Set the id of the error message container
                                        >
                                            {emailError}
                                        </div>
                                    )}
                                </div>

                                <div className="" style={{ height: '35px', minWidth: '0px', marginTop: '15px' }}>
                                    <input type="text"
                                        autoComplete="off"
                                        placeholder="Enter username"
                                        id="username"
                                        value={userName}
                                        className={`border ${isUsernameEmpty && !isInputFocused ? "placeholder-gray" : "placeholder-black"
                                            } input-field edit-form-label`}
                                        style={{ width: '100%', minWidth: '0px' }}
                                        onChange={(e) => setUserName(e.target.value)} />
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