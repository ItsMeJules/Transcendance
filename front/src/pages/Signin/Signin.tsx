import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { APP_ROUTES, API_ROUTES } from "utils/routing/routing";
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";
import ToastError from "layout/ToastError/ToastError";
import './Signin.scss'

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
      history(APP_ROUTES.DASHBOARD);
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

      <GlowTextSignin className="signin-header">sign in</GlowTextSignin>

      <div className="main-login-container">
        <div className="secondary-login-container">
          <div className="form-master-container">

            <div className="form-sub-container">
              <form onSubmit={handleSubmit} action="POST"className="signin-form">
                <label htmlFor="email" className="form-text-login-first">
                  Email address
                </label>

                <input type="email" // Max length?
                  placeholder="youremail@email.com"
                  id="emailaddress"
                  value={email}
                  className="input-text-login"
                  style={{ marginTop: '10px' }}
                  onChange={(e) => setEmail(e.target.value)}
                  required />

                <span className="cd-error-message">Error message here!</span>

                <label htmlFor="password" className="form-text-login-rest">
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
                  <button type="submit" className=" signin-submit-form-button">
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            <div className="signin-buttons-main">
              <button className="loginBtn loginBtn--42" onClick={RequestURI42}>Continue with 42</button>
              <button className="loginBtn loginBtn--google text-white" onClick={RequestURIGoogle}>Continue with Google</button>
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

      <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div >
  )
}

export default Signin;
