import React from 'react';
import { MDBTypography } from 'mdb-react-ui-kit';
import InputField from './InputField';

interface UserFormProps {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  setUsername: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  email,
  username,
  firstName,
  lastName,
  setUsername,
  setFirstName,
  setLastName,
  handleSubmit
}) => {
  return (
    <form action="POST" onSubmit={handleSubmit}>
      <MDBTypography tag="h5" className="data-values-input-sub-first" title={email}>
        {email}
      </MDBTypography>

      <InputField
        id="username"
        placeholder="Enter username"
        value={username}
        className="data-values-input-sub-second border edit-form-label"
        onChange={setUsername}
        maxLength={100}
      />

      <InputField
        id="firstname"
        placeholder="Enter first name"
        value={firstName}
        className="data-values-input-sub-others border edit-form-label"
        onChange={setFirstName}
        maxLength={100}
      />

      <InputField
        id="lastname"
        placeholder="Enter last name"
        value={lastName}
        className="data-values-input-sub-others border edit-form-label"
        onChange={setLastName}
        maxLength={100}
      />

      <div className="save-button">
        <button type="submit" className="save-changes-button">
          Save changes
        </button>
      </div>
    </form>
  );
};

export default UserForm;