import { useState, useRef, useEffect, FormEvent, useContext } from "react";
import ParticleSlow from "../components/ParticleSlow"
import { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackgroundNew from "../components/ParticlesSlow.memo";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { AxiosError } from "axios";
import { APP_ROUTES, API_ROUTES } from "../utils/constants";
import { text_glow, GlowTextSignin } from "../utils";
import User from "../services/user";

export const Signin = () => {
    const { setAuth } = useContext(AuthContext);
    const emailRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);
    const history = useNavigate();

    const [email, setEmail] = useState('');
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
                JSON.stringify({ email: email, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
            // User.getInstance().setAccessToken(response.data.accessToken);
            setEmail('');
            setPassword('');
            setSuccess(true);

        } catch (err: any) {
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
        <div className="login-container flex justify-center border border-white" style={{ zIndex: '1' }}>
            <GlowTextSignin className="font-dune items-center border border-white justify-center text-bold text-white" style={{ fontSize: '2rem', paddingTop: '50px', zIndex: '1' }}>
                sign in
            </GlowTextSignin>

            <p ref={errRef} className={errMsg ? "errmsg text-white" :
                "offscreen"} aria-live="assertive">
                {errMsg}
            </p>

            <div className="flex items-center justify-center flex border border-white w-full" style={{ top: '50px', position: 'relative', zIndex: '1' }}>
                <div className="flex justify-center border border-red" style={{ height: '500px', width: 400, position: 'relative', zIndex: '1' }}>
                    <div className="flex"
                        style={{ flexDirection: 'column', top: '25px', height: '300px', width: 350, position: 'relative' }}>

                        <div className="flex border border-white"
                            style={{ height: '250px', width: 350, marginBottom: '10px' }}>
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
                                        Sign in
                                    </button>
                                </div>

                            </form>
                        </div>

                        <div className=" justify-center items-center border border-white"
                            style={{ top: '275px', height: '50px', width: 350, position: "absolute" }}>
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
        </div>
    )
}