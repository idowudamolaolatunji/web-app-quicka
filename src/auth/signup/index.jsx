import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import { Link, useNavigate } from 'react-router-dom';
import { useFetchedContext } from '../../context/FetchedContext';
import { validateAuthForm } from '../../utils/validationHelper';

import { useWindowSize } from 'react-use';
import { FaCheck } from 'react-icons/fa';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import data_img from '../../assets/images/resources/micheal-ogungbe-pBR_6uEh6F0-unsplash.jpg'
import Asterisk from '../../components/elements/Asterisk';
import AuthUserRating from '../../components/layout/AuthUserRating';
import AuthsUI from '../../ui/authUI';
import { GoogleLogin } from '@react-oauth/google';
import { useCheckInternetConnection } from '../../hooks/useCheckInternetConnection';
import { InternetConnectionErrorMini } from '../../components/layout/InternetConnectionError';


const BASE_API_URL = import.meta.env.VITE_API_URL;
const authMethod = localStorage.getItem(`${import.meta.env.VITE_AUTHMETHOD_KEY}`)

function index() {
    const internetStatus = useCheckInternetConnection();
    const { handleFetchError } = useFetchedContext();
    const headingText = "The Power to Manage Your Business, at Your Fingertips."

    const [showPassword, setShowPassword] = useState({ main: false, confirm: false });
    const [isChecked, setIsChecked] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState({ authLoading: false, mainLoading: false });
    const [response, setResponse] = useState({ status: '', message: '' })

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        phoneNumber: '',
        dialCode: '',
        countryCode: '',
        country: '',
        password: '',
        passwordConfirm: ''
    });


    const { width } = useWindowSize();
    const navigate = useNavigate();

    const handleFormChange = function (e, val, opts) {
        if (!e && (val || opts)) {
            const { dialCode, countryCode, name } = opts;
            const phone = val?.startsWith(dialCode + '0') ? val?.replace(dialCode + '0', dialCode) : val;
            const phoneNumber = phone?.replace(dialCode, "");

            setFormData({ ...formData, phone, phoneNumber, dialCode, countryCode, country: name });
            return;
        }
        const { name, value } = e?.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLoading = function (key, value) {
        setLoading({
            ...loading, [key]: value,
        });
    }

    const handleResetResponse = function () {
        setResponse({ status: '', message: '' });
    }

    const handlePasswordShown = function (name) {
        setShowPassword({ ...showPassword, [name]: !showPassword[name] })
    }


    useEffect(function () {
        document.title = "Quicka - Create an Account 🎉 | Business Management Tool for SME's";
    }, []);

    useEffect(function () {
        if (loading.mainLoading) {
            handleResetResponse()
        }
    }, [loading.mainLoading]);


    async function handleGoogleAuthSignup(response) {
        handleLoading('mainLoading', true);
        try {
            // CHECK CONNECTION
            if(internetStatus == "offline") throw new Error("Internet Error");

            const { credential } = response;
            const res = await fetch(`${BASE_API_URL}/auth/google/signup`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ token: credential }),
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();
            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data.message);
            }

            // SAVE USER NEEDED INFO IN LOCALSTORAGE
            const { user } = data?.data;
            localStorage.setItem(`${import.meta.env.VITE_AUTHMETHOD_KEY}`, user?.authMethod || "google");
            localStorage.setItem(`${import.meta.env.VITE_CONGRATS_KEY}`, "access");
            localStorage.setItem(`${import.meta.env.VITE_USERID_KEY}`, user._id);

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data.status, message: data.message });
            setTimeout(function () {
                navigate('/congratulations?next=onboarding');
            }, 1000);

        } catch(err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();

        const newErrors = validateAuthForm(formData, 'signup');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => handleResetResponse(), 5000);
            return
        };

        if (!isChecked) {
            // IF THE CHECKED IS NOT CHECKED
            setResponse({ status: "error", message: "Accept terms and conditions" });
            setTimeout(() => handleResetResponse(), 5000);
            return;
        }
        
        handleLoading('mainLoading', true);
        handleResetResponse();
        setShowPassword({ main: false, confirm: false });
        try {
            // CHECK CONNECTION
            if(internetStatus == "offline") throw new Error("Internet Error");
            
            const res = await fetch(`${BASE_API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ ...formData })
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data.message);
            }

            // SAVE USER NEEDED INFO IN LOCALSTORAGE
            const { user } = data?.data;
            localStorage.setItem(`${import.meta.env.VITE_OTPUSER_KEY}`, JSON.stringify(user));

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data.status, message: data.message });
            setTimeout(function () {
                navigate('/verify-otp');
            }, 1000);

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            handleLoading('mainLoading', false);
        }
    }


    return (
        <AuthsUI backText="Back to home" backLink="https://www.getquicka.com" dataimg={data_img} loading={loading?.mainLoading} response={response} heading={headingText} centered={false} overflowLeft={true}>

            <form className="auth--form" onSubmit={handleSubmit} style={{ padding: '8rem 0', width: '90%' }}>
                {internetStatus == "offline" && <InternetConnectionErrorMini />}
                <div>
                    <h2 className='form--heading' style={width > 850 ? { color: '#ff7a49' } : { color: 'inherit' }}>Create {width > 362 && "an"} Account 🎉</h2>
                    {width <= 850 && (
                        <div className='auth--extra-info'>
                            <p className='auth--right-text'>Simplify, Automate, Dominate: Business Made Easy with easy-to-use tools designed for entrepreneurs like you. Trusted by 200+ businesses</p>
                            <AuthUserRating />
                        </div>
                    )}
                </div>

                <div className="form--item">
                    <label className='form--label' htmlFor="email">Business Email <Asterisk /></label>
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


                <div className="form--grid">
                    <div className="form--item">
                        <label className='form--label' htmlFor="firstname">First Name <Asterisk /></label>
                        <input
                            type="text"
                            id="firstname" name='firstname'
                            className='form--input'
                            placeholder='John'
                            onChange={handleFormChange}
                            value={formData.firstname}
                        />
                        <span className="form--error-message">
                            {formErrors.firstname && formErrors.firstname}
                        </span>
                    </div>
                    <div className="form--item">
                        <label className='form--label' htmlFor="email">Last Name <Asterisk /></label>
                        <input
                            type="text"
                            id="lastname" name='lastname'
                            className='form--input'
                            placeholder='Doe'
                            onChange={handleFormChange}
                            value={formData.lastname}
                        />
                        <span className="form--error-message">
                            {formErrors.lastname && formErrors.lastname}
                        </span>
                    </div>
                </div>


                <div className="form--item">
                    <label className='form--label' htmlFor="phone">Phone Number <Asterisk /></label>

                    <PhoneInput
                        country={'ng'}
                        regions={'africa'}
                        value={formData.phone}
                        inputProps={{ name: 'phone', id: 'phone' }}
                        onChange={(num, countryOpts) => handleFormChange(null, num, countryOpts)}
                        inputClass='phone-input'
                        buttonStyle={{ backgroundColor: 'transparent', border: 'none', paddingLeft: '.4rem', height: '4rem', margin: '.2rem 0' }}
                        countryCodeEditable={false}
                        dropdownStyle={{ top: '100%', marginTop: 0, borderRadius: '.4rem', padding: '.2rem' }}
                    />

                    <span className="form--error-message">
                        {formErrors.phone && formErrors.phone}
                    </span>
                </div>


                <div className="form--item">
                    <label className='form--label' htmlFor="password">Password <Asterisk /></label>
                    <div className="form--input-box">
                        <input
                            type={showPassword.main ? "text" : "password"}
                            name='password'
                            id="password"
                            className='form--input'
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            value={formData.password}
                            onChange={handleFormChange}
                            autoComplete="new-password"
                        />
                        <div className='form--input-icon' onClick={() => handlePasswordShown("main")}>
                            {showPassword.main ? <ImEye /> : <ImEyeBlocked />}
                        </div>
                    </div>
                    <span className="form--error-message">
                        {formErrors.password && formErrors.password}
                    </span>
                </div>

                <div className="form--item">
                    <label className='form--label' htmlFor="password-confirm">Password Confirm <Asterisk /></label>
                    <div className="form--input-box">
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            name='passwordConfirm'
                            id="password-confirm"
                            className='form--input'
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            value={formData.passwordConfirm}
                            onChange={handleFormChange}
                            autoComplete="new-password"
                        />
                        <div className='form--input-icon' onClick={() => handlePasswordShown("confirm")}>
                            {showPassword.confirm ? <ImEye /> : <ImEyeBlocked />}
                        </div>
                    </div>
                    <span className="form--error-message">
                        {formErrors.passwordConfirm && formErrors.passwordConfirm}
                    </span>
                </div>


                <div className="form--item-flex" onClick={() => width > 850 ? setIsChecked(!isChecked) : null}>
                    <div id="checkbox" className={isChecked ? 'is-selected' : ''} onClick={() => setIsChecked(!isChecked)}>
                        {isChecked && <FaCheck />}
                    </div>
                    <p className='form--info'>
                        I agree to the <a target='_blank' href='https://www.getquicka.com/terms'>Terms of Use</a> and <a target='_blank' href='https://www.getquicka.com/policy'>Privacy Policy</a>
                    </p>
                </div>

                <button type="submit" className='form--submit' disabled={internetStatus == "offline"}>Continue</button>
                <div className="form--info">
                    <p>Already have an account? <Link to='/login'>Login</Link></p>
                </div>

                <div className="or--text">or</div>

                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            handleGoogleAuthSignup(credentialResponse)
                        }}
                        text={authMethod == "google" ? "continue_with" : "signup_with"}
                        logo_alignment="center"
                        width="300px"
                        ux_mode="popup"
                        size="large"
                    />
                </div>

                {width > 850 && <div style={{ paddingBottom: '6rem' }} />}
            </form>

        </AuthsUI>
    )
}

export default index