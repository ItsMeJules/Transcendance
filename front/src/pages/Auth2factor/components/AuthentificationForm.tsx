import React, { FormEvent } from 'react';
import 'pages/Auth2factor/css/AuthentificationForm.scss';

interface AuthentificationFormProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

const AuthentificationForm: React.FC<AuthentificationFormProps> = ({ code, setCode, handleSubmit }) => {
  return (
    <div className="auth-container flex justify-center">
      <form onSubmit={handleSubmit} action="POST" className="login-form-container w-full h-full">
        <label htmlFor="codepin" className="left-aligned-text w-full text-white auth-label text-center">
          Enter the PIN from your authenticator app
        </label>
        <input
          type="text"
          placeholder="Code"
          id="codepin"
          maxLength={6}
          value={code}
          className="input-field login-form-label flex text-black w-full justify-center items-center"
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <div className="button-container flex justify-center items-center">
          <button type="submit" className="flex signup-button w-full justify-center">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthentificationForm;