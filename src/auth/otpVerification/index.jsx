import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';
import AuthsUI from '../authComponents/AuthsUI';
import CustomAlert from '../../components/CustomAlert';
import Spinner from '../../components/spinner/spinner_two'
import { countdownTimer } from '../../utils/helper';
import { validateAuthForm } from '../../utils/validationHelper';

import { HiFingerPrint } from 'react-icons/hi';
import data_img from '../../assets/images/resources/ali-mkumbwa-K-f_gTvdwTM-unsplash.jpg'

const headingText = "Take Control of Your Business, Anywhere, Anytime";
const headers = { "Content-Type": "application/json" }

function index() {
    const [timeLeft, setTimeLeft] = useState('00:00');
    const [resent, setResent] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({ email: "", otp: "" });

    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });

    const [otpUser, setOtpUser] = useState(localStorage.getItem("otp_user") ? JSON.parse(localStorage.getItem("otp_user")) : null);


    const navigate = useNavigate();
    const { width } = useWindowSize();

    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }

    const handleChangeOtp = function(value) {
        setFormData({ ...formData, otp: value });
    }

    useEffect(function() {
        document.title = "Quicka | OTP Verification";

        if(!otpUser) return navigate('/login');

        countdownTimer(otpUser?.expiresIn, setTimeLeft);
        setFormData({ ...formData, email: otpUser?.email})
    }, []);

    useEffect(function() {
        localStorage.setItem("otp_user", JSON.stringify(otpUser));
    }, [otpUser])


    useEffect(function() {
        if(resent) countdownTimer(otpUser?.expiresIn, setTimeLeft);
    }, [resent]);     


    async function handleSubmit() {
        const newErrors = validateAuthForm(formData, 'verifyOtp');
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;

        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/verify-otp`, {
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
            
            const userId = data.data.user._id;
            localStorage.setItem("user_id", userId);
            localStorage.setItem(`${import.meta.env.VITE_CONGRATS_KEY}`, "access");

            setTimeout(function() {
                localStorage.removeItem("otp_user");
                navigate('/congratulations?next=onboarding');
            }, 1000);
        } catch (err) {
            setResponse({ status: 'error', message: err.message })
        } finally {
            setIsLoading(false);
        }
    }


    async function handleRequestOtp() {
        setIsLoading(true);
        setResent(false);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/request-otp`, {
                method: 'PATCH',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            if (!res.ok) {
                throw new Error("Something went wrong, Check internet connection");
            }

            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            const { status, message } = data;
            console.log(data);
            
            if (!status || status !== 'success') {
                throw new Error(message);
            }
            
            const { user } = data?.data;
            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status, message });
            setResent(true);
        
            setOtpUser({ ...otpUser, ...user });

        } catch (err) {
            setResponse({ status: 'error', message: err.message })
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            {isLoading && <Spinner />}
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            <AuthsUI 
                dataimg={data_img}
                heading={headingText}
                extras={{ marginBottom: '5.6rem' }}
                backLink={otpUser?.message ? "/login"  : "/signup"}
                backText={`Back to ${otpUser?.message ? "login" : "signup"}`}
            >
                <form className="auth--form" onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'center', width: '90%', ...(width > 850 && { marginTop: '-4rem' }) }}>
                    <div>
                        <HiFingerPrint style={{ fontSize: '3.4rem', marginBottom: '2rem' }} />

                        <h2 className='form--heading' style={{ overflowWrap: 'normal', hyphens: "none" }}>Welcome Back! {otpUser?.name}</h2>

                        {otpUser?.message && (
                            <h4 style={{ margin: "-.8rem 0 1.2rem"}}>Verify your email, Before you login!</h4>
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
                            {formErrors.otp && formErrors.otp}
                        </span>
                    </div>

                    <button onClick={handleSubmit} type='button' className='form--submit'>Continue</button>

                    {timeLeft == "00:00" && (
                        <div className="form--info">
                            <p>Didn't Recieve an OTP or OTP Expired? <button onClick={handleRequestOtp}>Resend!</button></p>
                        </div>
                    )}
                </form>
            </AuthsUI>
        </>
    )
}

export default index