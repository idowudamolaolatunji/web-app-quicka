import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { countdownTimer } from '../../utils/helper';
import { validateAuthForm } from '../../utils/validationHelper';

import { HiFingerPrint } from 'react-icons/hi';
import data_img from '../../assets/images/resources/ali-mkumbwa-K-f_gTvdwTM-unsplash.jpg'
import AuthsUI from '../../ui/authUI';


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const BASE_URL = import.meta.env.VITE_API_URL;
    const headingText = "Take Control of Your Business, Anywhere, Anytime";

    const headers = {
        "Content-type": "application/json"
    };

    const [timeLeft, setTimeLeft] = useState('00:00');
    const [resent, setResent] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({ email: "", otp: "" });

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });

    const [otpUser, setOtpUser] = useState(localStorage.getItem("otp_user") ? JSON.parse(localStorage.getItem("otp_user")) : null);


    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }

    const handleChangeOtp = function (value) {
        setFormData({ ...formData, otp: value });
    }

    useEffect(function () {
        document.title = "Quicka | OTP Verification";

        if (!otpUser) return navigate('/login');

        countdownTimer(otpUser?.expiresIn, setTimeLeft);
        setFormData({ ...formData, email: otpUser?.email })
    }, []);

    useEffect(function () {
        localStorage.setItem("otp_user", JSON.stringify(otpUser));
    }, [otpUser])


    useEffect(function () {
        if (resent) countdownTimer(otpUser?.expiresIn, setTimeLeft);
    }, [resent]);


    async function handleSubmit() {
        const newErrors = validateAuthForm(formData, 'verify_otp');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;

        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/users/verify-otp`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ ...formData })
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            console.log(data);
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data.message);
            }

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data?.status, message: data?.message });

            const userId = data?.data?.user._id;
            localStorage.setItem("user_id", userId);
            localStorage.setItem(`${import.meta.env.VITE_CONGRATS_KEY}`, "access");

            setTimeout(function () {
                localStorage.removeItem("otp_user");
                navigate('/congratulations?next=onboarding');
            }, 1000);
        } catch (err) {
            const message = err?.message == "Failed to fetch" ? "Check Connection" : err?.message
            setResponse({ status: "error", message });
        } finally {
            setLoading(false);
        }
    }


    async function handleRequestOtp() {
        setLoading(true);
        setResent(false);

        try {
            const res = await fetch(`${BASE_URL}/users/request-otp`, {
                method: 'PATCH',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data?.message);
            }

            const { user } = data?.data;
            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data?.status, message: data?.message });
            setResent(true);

            setOtpUser({ ...otpUser, ...user });

        } catch (err) {
            const message = err?.message == "Failed to fetch" ? "Check Connection" : err?.message
            setResponse({ status: "error", message });
        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthsUI
            dataimg={data_img}
            heading={headingText}
            loading={loading} response={response}
            extras={{ marginBottom: '5.6rem' }}
            backLink={otpUser?.message ? "/login" : "/signup"}
            backText={`Back to ${otpUser?.message ? "login" : "signup"}`}
        >
            <form className="auth--form" onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'center', width: '90%', ...(width > 850 && { marginTop: '-4rem' }) }}>
                <div>
                    <HiFingerPrint style={{ fontSize: '3.4rem', marginBottom: '2rem' }} />

                    <h2 className='form--heading' style={{ overflowWrap: 'normal', hyphens: "none" }}>Welcome Back! {otpUser?.name}</h2>

                    {otpUser?.message && (
                        <h4 style={{ margin: "-.8rem 0 1.2rem" }}>Verify your email, Before you login!</h4>
                    )}

                    <p className='form--info' style={{ cursor: "auto" }}>
                        We {resent ? 're-' : ''}sent a 4-digit code to{" "}
                        <span style={{ fontWeight: '700' }}>{otpUser?.email}</span>{" "}
                        <br />and it expires in{" "}
                        <span style={{ fontWeight: '700', color: '#ff7a49' }}>{timeLeft} mins</span>
                    </p>
                </div>

                <div className="form--item otp--item">
                    <OtpInput
                        value={formData.otp}
                        onChange={handleChangeOtp}
                        inputType="number"
                        numInputs={4}
                        renderSeparator={<span>{" "}</span>}
                        renderInput={(props) => <input {...props} />}
                        containerStyle={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}
                    />
                    <span className="form--error-message">
                        {formErrors?.otp && formErrors?.otp}
                    </span>
                </div>

                <button onClick={handleSubmit} type='button' className='form--submit'>Continue</button>

                {timeLeft == "00:00" && (
                    <div className="form--info">
                        <p>Didn't recieve an OTP or OTP expired? <button onClick={handleRequestOtp}>Resend!</button></p>
                    </div>
                )}
            </form>
        </AuthsUI>
    )
}

export default index