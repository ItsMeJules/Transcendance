import React, { FormEvent, useState, useEffect } from 'react';
import {MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import axios from 'axios';

import { UserData } from 'services/User/User';
import { API_ROUTES, APP_ROUTES } from 'utils/routing/routing';
import { useNavigate } from 'react-router-dom';


interface EditUserFormValidationProps {
  setErrMsg: (error: string) => void;
  userData: UserData | null;
}

const EditUserFormValidation: React.FC<EditUserFormValidationProps> = ({ setErrMsg, userData }) => {

  const [userDataNew, setUserDataNew] = useState<UserData | null>();
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const history = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataToSend: any = {};
    if (username)
      dataToSend.username = username;
    if (firstName)
      dataToSend.firstName = firstName;
    if (lastName)
      dataToSend.lastName = lastName;

    try {
      const response = await axios.patch(
        API_ROUTES.USER_PROFILE_EDIT,
        dataToSend,
        {
          withCredentials: true
        });
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserDataNew(response.data);
      // window.location.href = APP_ROUTES.USER_PROFILE;
      history(APP_ROUTES.USER_PROFILE_ABSOLUTE);
    } catch (err: any) {
      console.log(err.response?.data.message);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
        // window.location.href = APP_ROUTES.HOME;
        // history(APP_ROUTES.HOME);
      } else if (err.response?.status === 403) {
        setErrMsg(`${err.response.data.message}`);
      }
      else {
        setErrMsg('Login failed');
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
    }

  }, [userData]);

  const usernameValue = username || '';

  return (
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
          <MDBTypography tag="h5" className="data-values-input-sub-first" title={userData?.email}>
            {userData?.email}
          </MDBTypography>
          <input type="text" autoComplete="off" placeholder="Enter username" id="username" value={usernameValue}
            className={`data-values-input-sub-second border edit-form-label`}
            onChange={(e) => setUsername(e.target.value)} maxLength={100} />

          <input type="text" autoComplete="off" placeholder="Enter first name" id="firstname" value={firstName}
            className={`data-values-input-sub-others border edit-form-label`}
            onChange={(e) => setFirstName(e.target.value)} maxLength={100} />

          <input type="text" autoComplete="off" placeholder="Enter last name" id="lastname" value={lastName}
            className={`data-values-input-sub-others border edit-form-label`}
            onChange={(e) => setLastName(e.target.value)} maxLength={100} />

          <div className="save-button">
            <button type="submit" className="save-changes-button" style={{ marginTop: '10px' }}>
              Save changes
            </button>
          </div>
        </form>

      </MDBCardBody>
    </div>
  )
}

export default EditUserFormValidation;
