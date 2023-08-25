import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { APP_ROUTES, API_ROUTES } from "utils/routing/routing";
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";
import ToastError from "layout/ToastError/ToastError";

export const Signin = () => {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  function RequestURI42() {
    console.log("ok");
    let url = '/api/auth/42/login';
    if (url)
      document.location = (url) // 
  }

  function RequestURIGoogle() {
    let url = '/api/auth/google/login';
    try {
      if (url)
        window.location.href = url; // Use window.location.href to trigger the redirect
    } catch (err: any) {
      setErrMsg(err.response.data.message);
    }

  }

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  useEffect(() => {
    setErrMsg('');
  }, [email, password])

  useEffect(() => {
    if (success) {
      history('/profile/me')
    }
  }, [success, history]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_ROUTES.SIGN_IN,
        JSON.stringify({ email: email, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      localStorage.setItem('userData', JSON.stringify(response.data));
      // User.getInstance().setAccessToken(response.data.accessToken);
      setEmail('');
      setPassword('');
      setSuccess(true);

    } catch (err: any) {
      console.log(err.response.data.message);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing email or password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else if (err.response?.status === 403) {
        setErrMsg('Credentials incorrect');
      }
      else {
        setErrMsg('Login failed');
      }
    }
  }

  return (
    <div className="login-container">

      <GlowTextSignin
        className="signin-container border border-white"
        style={{ fontSize: '2rem', zIndex: '1', minWidth: '200px' }}>
        sign in
      </GlowTextSignin>

      {/* <p ref={errRef} className={errMsg ? "errmsg text-white" :
                "offscreen"} aria-live="assertive">
                {errMsg}
            </p> */}

      <div className="main-login-container">
        <div className="secondary-login-container">
          <div className="form-master-container">

            <div className="flex border border-white"
              style={{ height: '230px', width: 350, marginBottom: '0px' }}>
              <form onSubmit={handleSubmit}
                action="POST"
                className="login-form-container w-full h-full">

                <label htmlFor="email" className="form-text-login">
                  Email address
                </label>

                <input type="email"
                  placeholder="youremail@email.com"
                  id="emailaddress"
                  value={email}
                  className="input-text-login"
                  style={{ marginTop: '10px' }}
                  onChange={(e) => setEmail(e.target.value)}
                  required />

                <span className="cd-error-message">Error message here!</span>

                <label htmlFor="password" className="form-text-login"
                  style={{ marginTop: '10px' }}>
                  Password
                </label>

                <input type="password"
                  id="password"
                  name="password"
                  value={password}
                  className="input-text-login"
                  style={{ marginTop: '10px' }}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={100}
                  required />

                <div className="flex justify-center items-center" style={{ marginTop: '10px' }}>
                  <button type="submit" className="flex signup-button w-full justify-center" style={{ marginTop: '10px' }}>
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            <div className="flex border items-center" style={{ flexDirection: "column" }}>
              <div className="loginBtn loginBtn--42 text-white">
                <button className="text-white" onClick={RequestURI42}>Continue with 42</button>

              </div>
              <div className="flex" style={{ marginTop: '15px' }}>
                <button className="loginBtn loginBtn--google text-white" onClick={RequestURIGoogle}>Continue with Google</button>
              </div>

            </div>

            <div className="border">
              <p className="flex justify-center items-center text-white">
                No account yet?&nbsp;
                <Link to={APP_ROUTES.SIGN_UP} className="text-white">
                  Create an account.
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      <div id="toast">
        <div id="img">
          <img src='/images/error.png' alt="Error" />
        </div>
        <div id="desc">{errMsg}</div>
      </div>

      <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div >
  )
}

export default Signin;
