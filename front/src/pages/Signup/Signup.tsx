import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";
import { GlowTextSignin } from "utils/cssAnimation/cssAnimation";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import './Signup.scss'

export const Signup = () => {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const customAxiosInstance = useAxios();

  useEffect(() => {
    if (success) {
      history(APP_ROUTES.USER_PROFILE_EDIT_ABSOLUTE);
    }
  }, [success]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await customAxiosInstance.post(API_ROUTES.SIGN_UP,
        JSON.stringify({ email: email, username: username, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      localStorage.setItem('userData', JSON.stringify(response.data));
      setEmail('');
      setPassword('');
      setSuccess(true);
    } catch (err: any) { }
  }

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await customAxiosInstance.get(API_ROUTES.HOME_CHECK_TOKEN,
          {
            withCredentials: true
          })
        if (response.data.tokenState === 'HAS_TOKEN')
          return history(APP_ROUTES.USER_PROFILE_EDIT_ABSOLUTE);
      } catch (error) { };
    }
    // verifyToken();
  }, [])

  return (
    <div className="signup-container">
      <GlowTextSignin className="signup-header">sign up</GlowTextSignin>

      <div className="main-login-container">
        <div className="secondary-login-container">
          <div className="form-master-container">

            <div className="form-sub-container">
              <form onSubmit={handleSubmit}
                action="POST"
                className="signup-form">

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

                <button type="submit" className="signup-submit-form-button" style={{ marginTop: '10px' }}>
                  Sign up
                </button>

              </form>
            </div>

            <article className="signup-switch-to-signin">
              Already registered?&nbsp;
              <Link to={APP_ROUTES.SIGN_IN} className="link">
                Sign in.
              </Link>
            </article>

          </div>
        </div>
      </div>

    </div>
  )
}

export default Signup;
