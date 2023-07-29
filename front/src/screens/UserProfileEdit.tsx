import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import User from "../services/user";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { UserData } from "../services/user";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import ToastErrorMessage from "../components/ToastErrorMessage";

export const UserProfileEdit: React.FC = () => {
  const logout = useLogout();
  const userEmail = User.getInstance().getEmail();
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
  const history = useNavigate();


  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

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
      history(APP_ROUTES.USER_PROFILE);
    } catch (err: any) {
      console.log(err.response.data.message);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else if (err.response?.status === 403) {
        setErrMsg(`${err.response.data.message}`);
      }
      else {
        setErrMsg('Login failed');
      }
    }
  };

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
      } catch (err: any) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 403) {
          setErrMsg(`${err.response.data.message}`);
        }
      }
    }
  };


  return (
    <div className="vh-100 d-flex " style={{ paddingTop: '75px' }}>
      <MDBContainer className="profile-board-container">
        <MDBCard className="profile-board-card">

          <div className="profil-board-header-edit-profile">
            <button title="Log out" onClick={logout}>
              <MDBCardImage src='/images/logout.png' fluid style={{ width: '34px' }} />
            </button>
          </div>

          <div className="profile-pic-container">
            {profilePic ? (
              <div className="profile-pic-circle">

                <img src={profilePic} alt="" />

              </div>
            ) : (
              <div className="empty-profile-picture-container">
                <span style={{ fontSize: '1rem' }}>{profilePic}</span>
              </div>
            )}
          </div>

          <div className="profile-pic-upload-button">
            <label className="custom-file-input">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              Upload Profile Picture
            </label>
          </div>

          <div className="fade-line" style={{ marginTop: '20px' }}></div>

          <div className="information-display-main">
            <MDBCardBody className="data-fields-name-main">
              <MDBTypography className="data-fields-name-sub-first" tag="h5">
                Email
              </MDBTypography>
              <MDBTypography className="data-fields-name-sub-others" tag="h5">
                Username
              </MDBTypography>
              <MDBTypography className="data-fields-name-sub-others" tag="h5">
                First name
              </MDBTypography>
              <MDBTypography className="data-fields-name-sub-others" tag="h5">
                Last name
              </MDBTypography>
            </MDBCardBody>
            <MDBCardBody className="data-values-input-main">
              <form action="POST" onSubmit={handleSubmit}>
                <MDBTypography tag="h5" className="data-values-input-sub-first" title={User.getInstance().getData()?.email}>
                  {User.getInstance().getData()?.email}
                </MDBTypography>
                <input type="text" autoComplete="off" placeholder="Enter username" id="username" value={username}
                  className={`data-values-input-sub-second border ${isUsernameEmpty && !isInputFocused ? "placeholder-gray" : "placeholder-black"} edit-form-label`}
                  onChange={(e) => setUsername(e.target.value)} maxLength={100} />

                <input type="text" autoComplete="off" placeholder="Enter first name" id="firstname" value={firstName}
                  className={`data-values-input-sub-others border ${isFirstNameEmpty && !isInputFocused ? "placeholder-gray" : "placeholder-black"} edit-form-label`}
                  onChange={(e) => setFirstName(e.target.value)} maxLength={100} />

                <input type="text" autoComplete="off" placeholder="Enter last name" id="lastname" value={lastName}
                  className={`data-values-input-sub-others border ${isLastNameEmpty ? "placeholder-gray" : "placeholder-black"} edit-form-label`}
                  onChange={(e) => setLastName(e.target.value)} maxLength={100} />

                <div className="save-button">
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

      <ToastErrorMessage errMsg={errMsg} resetErrMsg={resetErrMsg} />

    </div>
  );
}