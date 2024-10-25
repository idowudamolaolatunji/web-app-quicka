import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rating } from '@mui/material';
import { useWindowSize } from 'react-use';

import { FaCheck } from 'react-icons/fa';
import { MdArrowBackIosNew } from 'react-icons/md';
import { ImEye, ImEyeBlocked } from 'react-icons/im';

import Spinner from '../../components/spinner/spinner_two'
import logo_black from '../../assets/images/logo/logo-black.png'
import logo_white from '../../assets/images/logo/logo-white.png'
import img_user1 from '../../assets/images/resources/user-img.jpg'
import img_user2 from '../../assets/images/resources/user-img2.jpg'
import img_user3 from '../../assets/images/resources/user-img3.jpg'
import img_user0 from '../../assets/images/resources/user-img4.jpg'
import '../auth.css'
import CustomAlert from '../../components/CustomAlert';
import { useAuthContext } from '../../context/AuthContext';


function index() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState({
        authLoading: false,
        mainLoading: false
    });
    const [response, setResponse] = useState({
        status: '',
        message: ''
    })

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const { user, handleChange } = useAuthContext();
    const smallHeight = width <= 600 && height <= 625;

    const handleFormChange = function (e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLoading = function (key, value) {
        setIsLoading({
            ...isLoading, [key]: value,
        });
    }

    const handleResetResponse = function() {
        setResponse({ status: '', message: '' });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const newErrors = validateAuthForm(formData, 'login');
        setFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) return;

        // NEXT, IMPLEMENT THE LOGIN REQUEST
        try {
            handleLoading('mainLoading', true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ ...formData })
            });
            if (!res.ok) {
                throw new Error("Something went wrong, Check internet connection");
			}
            
            // RESET THE RESPONSE STATE HERE
            handleResetResponse();

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }

            // UPDATE THE RESPONSE STATE WITH THE NEW VALUE
            setResponse({ status: data.status, message: data.message });
            setTimeout(function() {
                handleChange(data.data.user, data.token);
            }, 2000);
        } catch (err) {
            console.log(err)
            setResponse({ status: 'error', message: err.message })
        } finally {
            handleLoading('mainLoading', false);
        }
    }

    useEffect(function() {
        if (user) {
            navigate("/");
        }
    }, [user])

    return (
        <> 
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {isLoading.mainLoading && <Spinner /> }
            
            <section className='auth__section'>
                <div className="auth--left">
                    <div className='auth--left-top'>
                        {width <= 850 && (
                            <div className="auth--logo">
                                <img src={logo_black} alt="quicka logo" />
                            </div>
                        )}
                        <a href='https://www.getquicka.com' className='auth--left-link'>
                            <MdArrowBackIosNew />
                            <p>Back to home</p>
                        </a>
                    </div>


                    <div className="auth--left-container">
                        <form className="auth--form" onSubmit={handleSubmit} style={ smallHeight ? { margin: '8rem 0 3rem' } : {} }>
                            <div>
                                <h2 className='form--heading'>Welcome Back!👋🏿</h2>
                                {width <= 850 && (
                                    <div className='auth--extra-info'>
                                        <p className='auth--right-text'>Take Control, Grow, Manage, market, and succeed with easy-to-use tools designed for entrepreneurs like you. Trusted by 100+ businesses</p>
                                        <div className='auth--right-details'>
                                            <div className="auth--right-users">
                                                <img src={img_user0} alt="" />
                                                <img src={img_user1} alt="" />
                                                <img src={img_user2} alt="" />
                                                <img src={img_user3} alt="" />
                                            </div>

                                            <span className='auth--right-rating'>
                                                <span>
                                                    <Rating name="read-only" value={5} readOnly />
                                                    <p>5.0</p>
                                                </span>
                                                <p>from 20+ businesses</p>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="form--item">
                                <label className='form--label' htmlFor="email">Email Adress</label>
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
                                <label className='form--label' htmlFor="password">Password</label>
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

                            <button type="submit" className='form--submit'>Login</button>

                            <div className="form--info">
                                <p>Dont have an account? <Link to='/signup'>Create One</Link></p>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="auth--right">
                    <div className="auth--logo">
                        <img src={logo_white} alt="quicka logo" />
                    </div>
                    <h3 className="auth--right-heading">Manage your business online like the boss that you are.</h3>
                    <p className='auth--right-text'>Take Control, Grow, Manage, market, and succeed with easy-to-use tools designed for entrepreneurs like you. Trusted by 100+ businesses</p>

                    <div className='auth--right-details'>
                        <div className="auth--right-users">
                            <img src={img_user0} alt="" />
                            <img src={img_user1} alt="" />
                            <img src={img_user2} alt="" />
                            <img src={img_user3} alt="" />
                        </div>

                        <span className='auth--right-rating'>
                            <span>
                                <Rating name="read-only" value={5} readOnly />
                                <p>5.0</p>
                            </span>
                            <p>from 20+ businesses</p>
                        </span>
                    </div>
                </div>

            </section>
        </>
    )
}

export default index




<option>Animals & Pets</option>
<option>Baby Products</option>
<option>Books and Media</option>
<option>Arts and Crafts</option>
<option>Beauty and Skincare</option>
<option>Building and Construction</option>
<option>Education</option>
<option>Groceries</option>
<option>Drinks</option>
<option>Mens Fashion</option>
<option>Gym and Fitness</option>
<option>Electronics</option>
<option>Food & Beverages</option>
<option>Others</option>
<option>Home & Kitchen</option>
<option>Gaming</option>
<option>Health & Pharmaceuticals</option>
<option>Makeup and Cosmetics</option>
<option>Kids Fashion</option>
<option>Office Equipment</option>
<option>Personal Care</option>
<option>Phones and Tablets</option>
<option>Professional Services</option>
<option>Restaurant</option>
<option>Toys & Games</option>
<option>Womens Fashion</option>





 // const series = [
    //     {
    //         name: 'Total Sales',
    //         data: [104500, 52700, 52200, 45500, 105350, 92500, 104100, 98300, 45600, null, null, null],
    //         // data: [null, null, null, null, null, null, null, null, null, 0, 0, 0],
    //         color: '#ff7a49'
    //     },
    //     {
    //         name: 'Online Sales',
    //         data: [94300, 41900, 8700, 41200, 95600, 9800, 52100, 5100, 3600, null, null, null],
    //         // data: [null, null, null, null, null, null, null, null, null, 0, 0, 0],
    //         color: '#ffb59a'
    //     },
    //     {
    //         name: 'Offline Sales',
    //         data: [9600, 8500, 41200, 4300, 9700, 82100, 43600, 92700, 41900, null, null, null],
    //         // data: [null, null, null, null, null, null, null, null, null, 0, 0, 0],
    //         color: '#994020'
    //     }
    // ];




     // const totalSales = allSales.map((sale) => sale.products.reduce((sum, product) => sum + product.price, 0)).reduce((acc, sale) => acc + sale, 0);
    // const totalOfflineSales = offlineSales.map((sale) => sale.products.reduce((sum, product) => sum + product.price, 0)).reduce((acc, sale) => acc + sale, 0);