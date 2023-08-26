import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";
import ToastError from "layout/ToastError/ToastError";

import './LoginButtons.css'

export const Signup = () => {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [email, password])

  useEffect(() => {
    if (success) {
      history('/profile/me')
    }
  }, [success, history]);

  const resetErrMsg = () => {
    setErrMsg(''); // Reset errMsg to an empty string
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.SIGN_UP,
        JSON.stringify({ email: email, username: username, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      localStorage.setItem('userData', JSON.stringify(response.data));
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
        if (err.response.data.message === 'Username too long')
          setErrMsg('Username too long');
        else if (err.response.data.message === 'Password too long')
          setErrMsg('Password too long');
        else
          setErrMsg('Credentials taken');
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
        style={{ fontSize: '2rem', zIndex: '1' }}>
        sign up lololol
      </GlowTextSignin>

      <div className="main-login-container">
        <div className="secondary-login-container">
          <div className="form-master-container">

            <div className="flex border border-white"
              style={{ height: '310px', width: 350, marginBottom: '10px' }}>
              <form onSubmit={handleSubmit}
                action="POST"
                className="login-form-container w-full h-full">

                <label htmlFor="email" className="form-text-login">
                  Email address {errMsg}
                </label>

                <input type="email"
                  placeholder="youremail@email.com"
                  id="emailaddress"
                  value={email}
                  className="input-text-login"
                  style={{ marginTop: '10px' }}
                  onChange={(e) => setEmail(e.target.value)}
                  required />

                <label htmlFor="username" className="form-text-login"
                  style={{ marginTop: '10px' }}>
                  Username
                </label>

                <input type="text"
                  id="username"
                  name="username"
                  value={username}
                  className="input-text-login"
                  style={{ marginTop: '10px' }}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={100}
                  required />

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
                    Sign up
                  </button>
                </div>

              </form>
            </div>

            <div className="flex justify-center w-full items-center border border-white">
              <p className="flex justify-center items-center text-white">
                Already registered?&nbsp;
                <Link to={APP_ROUTES.SIGN_IN} className="text-white">
                  Sign in.
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      <ToastError errMsg={errMsg} resetErrMsg={resetErrMsg} />
    </div>
  )
}

export default Signup;
