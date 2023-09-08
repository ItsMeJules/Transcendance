import { useRef, useState, useEffect, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";
import { API_ROUTES } from "utils/routing/routing";
import "./css/2faButton.scss";
import { toast } from "react-toastify";

export const TwoFa = () => {
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
    if (codeRef.current) {
      codeRef.current.focus();
    }
    if (errorMessage === "unauthorized")
      toast.error("Enter your token from your authenticator app");
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [code]);

  useEffect(() => {
    if (success) {
      history("");
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
    <div
      className="login-container flex justify-center border border-white"
      style={{ zIndex: "1" }}
    >
      <GlowTextSignin
        className="font-dune items-center border border-white justify-center text-bold text-white"
        style={{ fontSize: "2rem", paddingTop: "50px", zIndex: "1" }}
      >
        2 Factor Authentication
      </GlowTextSignin>

      <p
        ref={errRef}
        className={errMsg ? "errmsg text-white" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <div
        className="flex items-center justify-center flex border border-white w-full"
        style={{ top: "50px", position: "relative", zIndex: "1" }}
      >
        <div
          className="flex justify-center border border-red"
          style={{
            height: "500px",
            width: 400,
            position: "relative",
            zIndex: "1",
          }}
        >
          <div
            className="flex"
            style={{
              flexDirection: "column",
              top: "25px",
              height: "300px",
              width: 350,
              position: "relative",
            }}
          >
            <div
              className="flex border border-white"
              style={{ height: "250px", width: 350, marginBottom: "10px" }}
            >
              <form
                onSubmit={handleSubmit}
                action="POST"
                className="login-form-container w-full h-full"
              >
                <label
                  htmlFor="email"
                  className="left-aligned-text w-full text-white"
                  style={{ zIndex: "1" }}
                >
                  Enter the PIN from your authenticator app
                </label>

                <input
                  ref={codeRef}
                  type="text"
                  placeholder="Code"
                  id="codepin"
                  maxLength={6}
                  value={code}
                  className="input-field login-form-label flex text-black"
                  style={{ marginTop: "10px" }}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />

                <div
                  className="flex justify-center items-center"
                  style={{ marginTop: "10px" }}
                >
                  <button
                    type="submit"
                    className="flex signup-button w-full justify-center"
                    style={{ marginTop: "10px" }}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
