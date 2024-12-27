import React, { useEffect, useState } from 'react'
import AuthsUI from '../../ui/authUI';

import { useWindowSize } from 'react-use';
import { validateAuthForm } from '../../utils/validationHelper';
import { useFetchedContext } from '../../context/FetchedContext';
import data_img from '../../assets/images/resources/oluwakemi-solaja-R8ED8o_xoVs-unsplash.jpg'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Asterisk from '../../components/elements/Asterisk';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { HiFingerPrint } from 'react-icons/hi2';
import Modal from "../../components/modal/ExtraSmall";
import { FcCancel } from 'react-icons/fc';
import isOnline from 'is-online';


function index() {
    const { resettoken } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { handleFetchError } = useFetchedContext();

    const BASE_URL = import.meta.env.VITE_API_URL;
    const headingText = "Reset Your Password and Regain Control with Confidence";

    const headers = {
        "Content-type": "application/json"
    };

    const [showModal, setShowModal] = useState(false);
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

    const handleResetResponse = function () {
        setResponse({ status: "", message: "" });
    }

    const handleCloseModal = function () {
        setShowModal(false);
    }

    useEffect(function () {
        document.title = "Quicka | Password Reset";
    }, []);


    useEffect(function () {
        async function handleValidateToken() {
            setLoading(true);
            handleResetResponse();
            
            try {
                // CHECK CONNECTION
                const connected = await isOnline();
                if (!connected) throw new Error("Internet Error");

                const res = await fetch(`${BASE_URL}/users/validate-reset-token/${resettoken}`,
                    { method: 'GET', headers }
                );

                // RESET THE RESPONSE STATE HERE
                handleResetResponse();

                const data = await res.json();
                if (!data?.status || data?.status !== 'success') {
                    if (data?.message !== "Success") {
                        setTimeout(() => navigate("/login"), 2500);
                    }

                    throw new Error(data?.message);
                }

                // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
                setResponse({ status: data?.status, message: data?.message });
            } catch (err) {
                const message = (err?.message == "Failed to fetch")
                    ? "Oops! Connection Error!!"
                    : err?.message
                setResponse({ status: "error", message });
            } finally {
                setLoading(false);
            }
        }

        if (resettoken) {
            handleValidateToken();
        } else {
            navigate("/login")
        }

    }, [resettoken]);


    async function handleSubmit(e) {
        e.preventDefault();

        const newErrors = validateAuthForm(formData, 'reset_password');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;

        setLoading(true);
        handleResetResponse()
        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if (!connected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_URL}/users/reset-password/${resettoken}`, {
                method: 'PATCH', headers,
                body: JSON.stringify(formData)
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                if (data?.message.includes("Token has expired")) {
                    setShowModal(true);
                    return;
                }
                throw new Error(data?.message);
            }

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data?.status, message: data?.message });
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthsUI backText="Back to login" backLink="/login" heading={headingText} loading={loading} response={response} dataimg={data_img} extras={{ marginBottom: '5.6rem' }}>

            {showModal && (
                <Modal className="mini" handleClose={handleCloseModal}>
                    <div className="modal--details">
                        <div className='modal--icon error'><FcCancel /></div>
                        <h3>Your access token has expired!</h3>

                        <p className='modal--text'>You can always request another password recovery email, and redo the process.</p>

                        <button className='form--submit' onClick={() => navigate("/forgot-password")}>Proceed to forgot password</button>
                    </div>
                </Modal>
            )}

            <form className="auth--form" onSubmit={handleSubmit} style={{ textAlign: 'center', width: '90%', ...(width > 850 && { marginTop: '-4rem' }) }}>
                <div>
                    {/* <MdPassword style={{ fontSize: '3.4rem', marginBottom: '2rem' }} /> */}
                    <HiFingerPrint style={{ fontSize: '3.4rem', marginBottom: '2rem' }} />
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
                            type={showPassword.passwordConfirm ? "text" : "password"}
                            name='passwordConfirm'
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

                <button type='submit' className='form--submit'>Change password</button>

                <div className="form--info">
                    <p>Remembered your password? <Link to='/login'>Login</Link></p>
                </div>
            </form>
        </AuthsUI>
    )
}

export default index