import { useRef, useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../utils/axiosConfig/axiosConfig";
import { API_ROUTES } from "../../utils/routing/routing";
import TwoFaContainer from './components/2faContainer';
import AuthenticationHeader from './components/AuthentificationHeader';
import ErrorMessage from './components/ErrorMessage';
import AuthentificationForm from './components/AuthentificationForm';

import './css/AuthentificationForm.scss';

export const Auth2factor = () => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const history = useNavigate();

  const [code, setCode] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchUserProfile = async () => {
    try {
      await axiosInstanceError.post(
        API_ROUTES.AUTHENTICATE_2FA,
        { twoFactorAuthentificationCode: "" },
        { withCredentials: true }
      );
    } catch (err: any) {}
  };

  useEffect(() => {
    fetchUserProfile();
    if (codeRef.current) {
      codeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [code]);

  useEffect(() => {
    console.log("success is !!!!!:", success);
    if (success) {
      history("/dashboard/profile/me");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const axiosInstanceError = useAxios();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axiosInstanceError.post(
        API_ROUTES.AUTHENTICATE_2FA,
        { twoFactorAuthentificationCode: code },
        { withCredentials: true }
      );
      setSuccess(true);
      setCode("");
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing email or password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized lol");
      } else if (err.response?.status === 450) {
        setErrMsg("You didn't enable 2FA");
        // history("/profile/me");
      } else {
        setErrMsg("Something went wrong");
      }
      errRef.current?.focus();
      setCode("");
      errRef.current?.focus();
    }
  };

  return (
    <TwoFaContainer>
      <AuthenticationHeader />
      <ErrorMessage errMsg={errMsg} />
      <AuthentificationForm code={code} setCode={setCode} handleSubmit={handleSubmit} />
    </TwoFaContainer>
  );
};

export default Auth2factor;
