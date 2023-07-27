import { useState, useRef, useEffect, FormEvent, useContext } from "react";
import ParticleSlow from "../components/ParticleSlow"
import { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { AxiosError } from "axios";
import { APP_ROUTES, API_ROUTES } from "../utils/constants";
import { text_glow, GlowTextSignin } from "../utils";

export const Signup = () => {
    const { setAuth } = useContext(AuthContext);
    const emailRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    useEffect(() => {
        if (success) {
            history('/profile/me')
        }
    }, [success]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(API_ROUTES.SIGN_UP,
                JSON.stringify({ email: email, username: username, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
            // console.log(response.data);
            setEmail('');
            setPassword('');
            setSuccess(true);
        } catch (err: any) {
            // console.log(err.response);
            console.log(err.response.data.message);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing email or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current?.focus();
        }
    }

    return (
        <div className="login-container">

            <GlowTextSignin
                className="signin-container border border-white"
                style={{ fontSize: '2rem', zIndex: '1' }}>
                sign up
            </GlowTextSignin>

            <div className="main-login-container">
                <div className="secondary-login-container">
                    <div className="form-master-container">

                        <div className="flex border border-white"
                            style={{ height: '310px', width: 350, marginBottom: '10px' }}>
                            <form onSubmit={handleSubmit}
                                action="POST"
                                className="login-form-container w-full h-full">

                                <label htmlFor="email"
                                    className="left-aligned-text w-full text-white"
                                    style={{ zIndex: '1' }}>
                                    Email address
                                </label>

                                <input type="email"
                                    placeholder="youremail@email.com"
                                    id="emailaddress"
                                    value={email}
                                    className="input-field login-form-label flex text-black"
                                    style={{ marginTop: '10px' }}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />

                                <label htmlFor="username"
                                    className="flex left-aligned-text  w-full text-white"
                                    style={{ marginTop: '10px' }}>
                                    Username
                                </label>

                                <input type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    className="input-field login-form-label flex text-black"
                                    style={{ marginTop: '10px' }}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required />

                                <label htmlFor="password"
                                    className="flex left-aligned-text  w-full text-white"
                                    style={{ marginTop: '10px' }}>
                                    Password
                                </label>

                                <input type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    className="input-field login-form-label flex text-black"
                                    style={{ marginTop: '10px' }}
                                    onChange={(e) => setPassword(e.target.value)}
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
        </div>
    )
}