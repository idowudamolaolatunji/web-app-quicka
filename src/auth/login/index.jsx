import React, { useEffect, useState } from 'react';
import { useLocalStorage, useWindowSize } from 'react-use';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import { validateAuthForm } from '../../utils/validationHelper';

// import data_img from '../../assets/images/resources/alex-robinson-rrI02QQ9GSQ-unsplash.jpg'
import data_img from '../../assets/images/resources/mockup.png'
import { FaCheck } from 'react-icons/fa';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import Asterisk from '../../components/elements/Asterisk';
import AuthsUI from '../../ui/authUI';
import AuthUserRating from '../../components/layout/AuthUserRating';
import { GoogleLogin } from '@react-oauth/google';
import { useCheckInternetConnection } from '../../hooks/useCheckInternetConnection';
import { InternetConnectionErrorMini } from '../../components/layout/InternetConnectionError';


const PREV_PATH = import.meta.env.VITE_PREV_URL_KEY
const BASE_API_URL = import.meta.env.VITE_API_URL;
const headingText = "Manage your business online like the boss that you are."

function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const [value, _, remove] = useLocalStorage(PREV_PATH);
    const { handleFetchError } = useFetchedContext();
    const { user, store, handleChange, handleStore } = useAuthContext();
    const internetStatus = useCheckInternetConnection();

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState({ authLoading: false, mainLoading: false });
    const [response, setResponse] = useState({ status: "", message: "" })
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isRequesting, setIsRequesting] = useState(false);

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    const handleFormChange = function (e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLoading = function (key, value) {
        setLoading({ ...loading, [key]: value, });
    }

    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }

    useEffect(function () {
        document.title = "Quicka - Welcome back 👋🏿 | Business Management Tool for SME's";
    }, []);


    async function handleGoogleAuthLogin(response) {
        setLoading({ ...loading, mainLoading: true })
        try {
            // CHECK CONNECTION
            if(internetStatus == "offline") throw new Error("Internet Error");

            const { credential } = response;
            const res = await fetch(`${BASE_API_URL}/auth/google/login`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ token: credential }),
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();
        
            const data = await res.json();
            const { status, message, token } = data;
            if (!status || status !== 'success') {
                throw new Error(message);
            }

            // USER MUST HAVE SETUP THEIR STORE TO LOGIN
            const { user, store } = data?.data;
            if (!store.basicSetup) {
                localStorage.setItem(`${import.meta.env.VITE_USERID_KEY}`, user?._id);
                localStorage.setItem(`${import.meta.env.VITE_AUTHMETHOD_KEY}`, user?.authMethod || "google");

                setResponse({ status, message });
                setTimeout(function () {
                    navigate('/onboarding');
                }, 1000);
                return;
            }

            setResponse({ status, message });
            setTimeout(function () {
                handleChange(user, token);
                handleStore(store);
            }, 500);

        } catch(err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const newErrors = validateAuthForm(formData, 'login');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;
        
        handleLoading('mainLoading', true);
        setIsRequesting(true);
        handleResetResponse();
        setShowPassword(false);
        try {
            // CHECK CONNECTION
            if(internetStatus == "offline") throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ ...formData })
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            const { status, message, token } = data;
            if (!status || status !== 'success') {
                // IF THE USER IS NOT VERIFIED, REDIRECT THE TO THE VERIFICATION PAGE
                if (message.startsWith("Account not verified.")) {
                    const { user } = data?.data;
                    localStorage.setItem(`${import.meta.env.VITE_OTPUSER_KEY}`, JSON.stringify({ ...user, message: "not_verified" }));

                    setTimeout(function () {
                        navigate('/verify-otp');
                    }, 1500);
                }

                // IF AND ELSE THROW NEW ERROR
                throw new Error(message);
            }

            // USER MUST HAVE SETUP THEIR STORE TO LOGIN
            const { user, store } = data?.data;
            if (!store.basicSetup) {
                localStorage.setItem(`${import.meta.env.VITE_USERID_KEY}`, user._id);
                localStorage.setItem(`${import.meta.env.VITE_AUTHMETHOD_KEY}`, user?.authMethod || "email/password");

                setResponse({ status, message });
                setTimeout(function () {
                    navigate('/onboarding');
                }, 1000);
                return;
            }

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status, message });
            setTimeout(function () {
                handleChange(user, token);
                handleStore(store);
            }, 500);
        } catch (err) {
            setIsRequesting(false);
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            handleLoading('mainLoading', false);
        }
    }

    useEffect(function () {
        if (user && store) {
            if(value) {
                navigate(value);
                remove();
            } else {
                navigate("/");
            }
        }
    }, [user, store])


    /*
    
        Extras: they are just extra inline-styles for certain pages
            - On the extras we passed in marginBottom there for a reason that i don't understand here..
            - Also note that the marginBottom style is also added on the OTP page, and forgot password page
            - Anyother styles can be passed there..
        AuthsUI: the's are container ui components for auth pages
    
    */


    return (
        <AuthsUI backText="Back to home" backLink="https://www.getquicka.com" dataimg={data_img} loading={loading?.mainLoading} response={response} heading={headingText} extras={{ marginBottom: '5.6rem' }}>
            <form className="auth--form" onSubmit={handleSubmit} style={width > 850 ? { marginTop: "-2rem" /* this was because of the google button */ } : {}}>
                {internetStatus == "offline" && <InternetConnectionErrorMini />}

                <div>
                    <h2 className='form--heading' style={width > 850 ? { marginBottom: "2rem" } : {}}>Welcome Back!👋🏿</h2>
                    {width <= 850 && (
                        <div className='auth--extra-info'>
                            <p className='auth--right-text'>Take Control, Grow, Manage, market, and succeed with easy-to-use tools designed for entrepreneurs like you. Trusted by 200+ businesses</p>
                            <AuthUserRating />
                        </div>
                    )}
                </div>

                <div className="form--item">
                    <label className='form--label' htmlFor="email">Email Adress <Asterisk /></label>
                    <input
                        type="text"
                        id="email" name='email'
                        className='form--input'
                        placeholder='youremail@email.com'
                        onChange={handleFormChange}
                        value={formData.email}
                    />
                    <span className="form--error-message">
                        {formErrors.email && formErrors.email}
                    </span>
                </div>

                <div className="form--item">
                    <label className='form--label' htmlFor="password">Password <Asterisk /></label>
                    <div className="form--input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            name='password'
                            id="password"
                            className='form--input'
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            value={formData.password}
                            onChange={handleFormChange}
                        />
                        <div className='form--input-icon' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <ImEye /> : <ImEyeBlocked />}
                        </div>
                    </div>
                    <span className="form--error-message">
                        {formErrors.password ? formErrors.password : ''}
                    </span>
                </div>

                <div className="form--flex">
                    <div className="form--item-flex" onClick={() => setIsChecked(!isChecked)}>
                        <div id="checkbox" className={isChecked ? 'is-selected' : ''}>
                            {isChecked && <FaCheck />}
                        </div>
                        <label className='form--text' htmlFor="checkbox">Remember Password</label>
                    </div>

                    <Link to='/forgot-password'>Forgot Password</Link>
                </div>

                <button type="submit" className='form--submit' disabled={isRequesting || internetStatus == "offline"}>Login</button>

                <div className="form--info">
                    <p>Dont have an account? <Link to='/signup'>Create account</Link></p>
                </div>

                <div className="or--text">or</div>

                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            handleGoogleAuthLogin(credentialResponse)
                        }}
                        text="continue_with"
                        logo_alignment="center"
                        // width="100px"
                        width="300px"
                        ux_mode="popup"
                        size="large"
                    />
                </div>
            </form>

        </AuthsUI>
    )
}

export default index