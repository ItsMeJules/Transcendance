import React, { FormEvent } from 'react';
import 'pages/Auth2factor/css/AuthentificationForm.scss'

interface AuthentificationFormProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

const AuthentificationForm: React.FC<AuthentificationFormProps> = ({ code, setCode, handleSubmit }) => {
    return (
        <div className="auth-container flex justify-center border border-red">
            <div className="auth-column flex">
                <div className="auth-border flex border border-white">
                    <form onSubmit={handleSubmit} action="POST" className="login-form-container w-full h-full">
                        <label htmlFor="email" className="left-aligned-text w-full text-white auth-label">
                            Enter the PIN from your authenticator app
                        </label>
                        <input
                            type="text"
                            placeholder="Code"
                            id="codepin"
                            maxLength={6}
                            value={code}
                            className="input-field login-form-label flex text-black"
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
            </div>
        </div>
    );
}

export default AuthentificationForm;
