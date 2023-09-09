import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { APP_ROUTES, API_ROUTES } from "utils/routing/routing";
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import "./Signin.scss";
import { toast } from "react-toastify";

export const Signin = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get("error");
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const customAxiosInstance = useAxios();

  function RequestURI42() {
    let url = "/api/auth/42/login";
    if (url) document.location = url;
  }

  function RequestURIGoogle() {
    let url = "/api/auth/google/login";
    if (url) window.location.href = url;
  }

  useEffect(() => {
    if (success) {
      history(APP_ROUTES.USER_PROFILE_EDIT_ABSOLUTE);
    }
  }, [success]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await customAxiosInstance.post(
        API_ROUTES.SIGN_IN,
        JSON.stringify({ email: email, password: password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      localStorage.setItem("userData", JSON.stringify(response.data));
      setEmail("");
      setPassword("");
      setSuccess(true);
    } catch (err: any) {}
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await customAxiosInstance.get(API_ROUTES.HOME_CHECK_TOKEN,
          {
            withCredentials: true
          })
        if (response.data.tokenState === 'HAS_TOKEN')
          return history(APP_ROUTES.USER_PROFILE_ABSOLUTE);
      } catch (error) { };
    }

    if (errorMessage === 'nouser')
      toast.error('No user found');
    if (errorMessage === 'passwordrequired')
      toast.error('This account has a password provided, please sign in via the form.');
    if (errorMessage === 'unauthorized')
      toast.error('Unauthorized. Please log in again.');
    // verifyToken();
  }, [])

  return (
    <div className="login-container">
      <GlowTextSignin className="signin-header">sign in</GlowTextSignin>

      <div className="main-login-container">
        <div className="secondary-login-container">
          <div className="form-master-container">
            <div className="form-sub-container">
              <form onSubmit={handleSubmit} action="POST" className="signin-form">
                <label htmlFor="email" className="form-text-login-first">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="youremail@email.com"
                  id="emailaddress"
                  value={email}
                  className="input-text-login"
                  style={{ marginTop: "10px" }}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <span className="cd-error-message">Error message here!</span>

                <label htmlFor="password" className="form-text-login-rest">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  className="input-text-login"
                  style={{ marginTop: "10px" }}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={100}
                  required
                />

                <div
                  className="flex justify-center items-center"
                  style={{ marginTop: "10px" }}
                >
                  <button type="submit" className=" signin-submit-form-button">
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            <div className="signin-buttons-main">
              <button className="loginBtn loginBtn--42" onClick={RequestURI42}>
                Continue with 42
              </button>
              <button
                className="loginBtn loginBtn--google text-white"
                onClick={RequestURIGoogle}
              >
                Continue with Google
              </button>
            </div>

            <article className="signin-switch-to-signup">
              No account yet?&nbsp;
              <Link to={APP_ROUTES.SIGN_UP} className="link">
                Create an account.
              </Link>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
