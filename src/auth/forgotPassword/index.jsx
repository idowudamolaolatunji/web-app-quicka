import React, { useEffect, useState } from 'react'
import AuthsUI from '../../ui/authUI';

import data_img from '../../assets/images/resources/good-faces-lhMdsnK_KWk-unsplash.jpg'
import { HiLockClosed } from 'react-icons/hi2';
import Asterisk from '../../components/Asterisk';
import { useWindowSize } from 'react-use';
import { validateAuthForm } from '../../utils/validationHelper';
import { Link } from 'react-router-dom';


function index() {
    const { width } = useWindowSize();
    const BASE_URL = import.meta.env.VITE_API_URL;
    const headingText = "Manage Your Business and Safeguard Security with Confidence."

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });
    const [formData, setFormData] = useState({ email: "" });
    const [formErrors, setFormErrors] = useState({});

    const handleFormChange = function (event) {
        const { name, value } = event?.target;
        setFormData({ ...formData, [name]: value });
    }

    useEffect(function() {
        document.title = "Quicka | Forgot Password";
    }, []);


    async function handleSubmit() {
        const newErrors = validateAuthForm(formData, 'forgot_password');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;
        
        setLoading(true)
        try {

            const res = await fetch(`${BASE_URL}/users/forgot-password`, {
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
            
        } catch(err) {

        } finally {
            setLoading(false);
        }
    }
    

    return (
            <AuthsUI backText="Back to login" backLink="/login" heading={headingText} loading={loading} response={response} dataimg={data_img} extras={{marginBottom: '5.6rem'}}>
                <form className="auth--form" onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'center', width: '90%', ...(width > 850 && { marginTop: '-4rem' }) }}>
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

                <button type='button' onClick={handleSubmit} className='form--submit'>Send reset email</button>

                <div className="form--info">
                    <p>Remembered your password? <Link to='/login'>Login</Link></p>
                </div>

                </form>
            </AuthsUI>
    )
}

export default index