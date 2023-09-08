import { useRef, useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAxios } from "../../utils/axiosConfig/axiosConfig";
import { API_ROUTES, APP_ROUTES } from "../../utils/routing/routing";
import TwoFaContainer from "./components/2faContainer";
import AuthenticationHeader from "./components/AuthentificationHeader";
import ErrorMessage from "./components/ErrorMessage";
import AuthentificationForm from "./components/AuthentificationForm";
import { toast } from "react-toastify";
import "./css/AuthentificationForm.scss";

export const Auth2factor = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get("error");
  const errRef = useRef<HTMLParagraphElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const history = useNavigate();

  const [code, setCode] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchUserProfile = async () => {
    try {
      await customAxiosInstance.post(
        API_ROUTES.AUTHENTICATE_2FA,
        { twoFactorAuthentificationCode: "" },
        { withCredentials: true }
      );
    } catch (err: any) {}
  };

  useEffect(() => {
    fetchUserProfile();
    if (codeRef.current) codeRef.current.focus();
    if (errorMessage === "need2fa") toast.error("You have to connect with 2FA");
    if (errorMessage === "unauthorized")
      toast.error("Enter your token from your authenticator app");
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [code]);

  useEffect(() => {
    if (success) {
      history(APP_ROUTES.USER_PROFILE_ABSOLUTE);
    }
  }, [success]);

  const customAxiosInstance = useAxios();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await customAxiosInstance.post(
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
