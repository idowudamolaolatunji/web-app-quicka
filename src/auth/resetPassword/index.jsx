import React, { useEffect, useState } from 'react'
import AuthsUI from '../../ui/authUI';

import { useWindowSize } from 'react-use';
import { validateAuthForm } from '../../utils/validationHelper';
import { CgPassword } from 'react-icons/cg';
import data_img from '../../assets/images/resources/oluwakemi-solaja-R8ED8o_xoVs-unsplash.jpg'
import { Link } from 'react-router-dom';
import Asterisk from '../../components/Asterisk';
import { ImEye, ImEyeBlocked } from 'react-icons/im';

function index() {
    const { width } = useWindowSize();
    const BASE_URL = import.meta.env.VITE_API_URL;
    const headingText = "Reset Your Password and Regain Control with Confidence"

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });
    const [formData, setFormData] = useState({ password: "", passwordConfirm: "" });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState({ password: false, passwordConfirm: false });

    const handleFormChange = function (event) {
        const { name, value } = event?.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleShowPassword = function (name) {
        setShowPassword({ ...showPassword, [name]: !showPassword[name] });
    }

    useEffect(function () {
        document.title = "Quicka | Password Reset";
    }, []);


    async function handleSubmit() {
        const newErrors = validateAuthForm(formData, 'reset_password');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;

        setLoading(true)
        try {

            const res = await fetch(`${BASE_URL}/users/reset-password`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ ...formData })
            });

            if (!res.ok) throw new Error("Something went wrong, Check internet connection");

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            console.log(data);
            if (data.status !== 'success') {
                throw new Error(data.message);
            }

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data.status, message: data.message });

        } catch (err) {

        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthsUI backText="Back to login" backLink="/login" heading={headingText} loading={loading} response={response} dataimg={data_img} extras={{ marginBottom: '5.6rem' }}>
            <form className="auth--form" onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'center', width: '90%', ...(width > 850 && { marginTop: '-4rem' }) }}>
                <div>
                    <CgPassword style={{ fontSize: '3.4rem', marginBottom: '2rem' }} />
                    <h2 className='form--heading'>Reset your Password?</h2>
                    <p className='form--info' style={{ cursor: "auto" }}>
                        Enter a new password different from the previous ones your might have uesd.
                    </p>
                </div>


                <div className="form--item">
                    <label className='form--label'>Password <Asterisk /></label>
                    <div className="form--input-box">
                        <input
                            type={showPassword.password ? "text" : "password"}
                            name='password'
                            className='form--input'
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            value={formData.password}
                            onChange={handleFormChange}
                        />
                        <div className='form--input-icon' onClick={() => handleShowPassword("password")}>
                            {showPassword.password ? <ImEye /> : <ImEyeBlocked />}
                        </div>
                    </div>

                    <span className="form--error-message">
                        {formErrors?.password && formErrors?.password}
                    </span>
                </div>

                <div className="form--item">
                    <label className='form--label'>Password Confirm <Asterisk /></label>
                    <div className="form--input-box">
                        <input
                            type={showPassword.passwordConfirm ? "text" : "passwordConfirm"}
                            name='passwordConfirm'
                            id="passwordConfirm"
                            className='form--input'
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            value={formData.passwordConfirm}
                            onChange={handleFormChange}
                        />
                        <div className='form--input-icon' onClick={() => handleShowPassword("passwordConfirm")}>
                            {showPassword.passwordConfirm ? <ImEye /> : <ImEyeBlocked />}
                        </div>
                    </div>

                    <span className="form--error-message">
                        {formErrors?.passwordConfirm && formErrors?.passwordConfirm}
                    </span>
                </div>

                <button type='button' onClick={handleSubmit} className='form--submit'>Change password</button>

                <div className="form--info">
                    <p>Remembered your password? <Link to='/login'>Login</Link></p>
                </div>
            </form>
        </AuthsUI>
    )
}

export default index