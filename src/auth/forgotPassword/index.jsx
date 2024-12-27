import React, { useEffect, useState } from 'react'
import AuthsUI from '../../ui/authUI';

import data_img from '../../assets/images/resources/good-faces-lhMdsnK_KWk-unsplash.jpg'
import { HiLockClosed } from 'react-icons/hi2';
import Asterisk from '../../components/elements/Asterisk';
import { useWindowSize } from 'react-use';
import { validateAuthForm } from '../../utils/validationHelper';
import { Link } from 'react-router-dom';
import Modal from "../../components/modal/ExtraSmall";
import { HiOutlineMailOpen } from 'react-icons/hi';
import isOnline from 'is-online';
import { useFetchedContext } from '../../context/FetchedContext';


function index() {
    const { width } = useWindowSize();
    const { handleFetchError } = useFetchedContext();
    const BASE_URL = import.meta.env.VITE_API_URL;
    const headingText = "Manage Your Business and Safeguard Security with Confidence."

    const headers = {
        "Content-type": "application/json"
    };

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });
    const [formData, setFormData] = useState({ email: "" });
    const [formErrors, setFormErrors] = useState({});


    const handleCloseModal = function () {
        setShowModal(false);
    }

    const handleFormChange = function (event) {
        const { name, value } = event?.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleResetResponse = function () {
        setResponse({ status: "", message: "" });
    }

    useEffect(function () {
        document.title = "Quicka | Forgot Password";
    }, []);


    async function handleSubmit(e) {
        e.preventDefault();
        
        const newErrors = validateAuthForm(formData, 'forgot_password');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;
        
        setLoading(true);
        handleResetResponse();
        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if (!connected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_URL}/users/forgot-password`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ ...formData })
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data?.message);
            }

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data?.status, message: data?.message });
            setShowModal(true)
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
                <Modal className="mini">
                    <div className="modal--details">
                        <div className='modal--icon success'><HiOutlineMailOpen /></div>
                        <h3>Check your email</h3>
                        <p className='modal--text'>We have sent password reset to your email</p>

                        {width <= 600 ? (
                            <a href="mailto:" className='form--submit'>Open your gmail app</a>
                            // <a href="intent://gmail/#Intent;scheme=mailto;action=android.intent.action.VIEW;end" className='form--submit'>Open your gmail app</a>
                        ) : (
                            <a href='https://mail.google.com/' target='_blank' className='form--submit'>Open your gmail</a>
                        )}
                        <div className="form--info"><button onClick={handleCloseModal}>Skip I'll Conform Later</button></div>
                    </div>
                </Modal>
            )}


            <form className="auth--form" onSubmit={handleSubmit} style={{ textAlign: 'center', width: '90%', ...(width > 850 && { marginTop: '-4rem' }) }}>
                <div>
                    <HiLockClosed style={{ fontSize: '3.4rem', marginBottom: '2rem' }} />

                    <h2 className='form--heading'>Forgot Password?</h2>

                    <p className='form--info' style={{ cursor: "auto" }}>
                        Enter the email associated with your account and we'll send you an email with intructions to reset your password.
                    </p>
                </div>


                <div className="form--item">
                    <label className='form--label'>Email Address <Asterisk /></label>
                    <input type="email" name="email" className="form--input" placeholder='example@mail.com' value={formData.email} onChange={handleFormChange} />
                    <span className="form--error-message">
                        {formErrors?.email && formErrors?.email}
                    </span>
                </div>

                <button type='submit' className='form--submit'>Send reset email</button>

                <div className="form--info">
                    <p>Remembered your password? <Link to='/login'>Login</Link></p>
                </div>

            </form>
        </AuthsUI>
    )
}

export default index