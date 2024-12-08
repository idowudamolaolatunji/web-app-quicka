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
    const [Loading, setLoading] = useState({
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
        setLoading({
            ...Loading, [key]: value,
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
            }, 2500);
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

            {Loading.mainLoading && <Spinner /> }
            
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


<!--  -->

body:has(.dashboard--base) {
    height: 100vh;
    overflow: hidden;
}

.dashboard--header {
    display: grid;
    grid-template-columns: 24rem 1fr;
    height: 7rem;
    position: relative;
    z-index: 80;
}   

.dashboard--base {
    transition: all .3s ease;
    display: grid;
    grid-template-columns: 24rem 1fr;
}
.dashboard--base.collapsed {
    grid-template-columns: 6rem 1fr;
}


.dashboard--menu {
    height: 90vh;
    padding: 2.5rem 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    border-right: 1.2px solid var(--border-color);
    overflow-y: auto;
    scrollbar-width: none;
    transition: all .3s ease;
}

.content--block {
    padding: 3.6rem 2.4rem 2.4rem;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 90vh;
}



==============900

body:has(.dashboard--base) {
    overflow-x: hidden;
    overflow-y: unset;
    height: auto;
} 
.content--block {
    padding: 10rem 2rem .6rem;
    height: fit-content;
    overflow-y: unset;
    margin-left: unset;
}



.dashboard--header {
    grid-template-columns: 18rem 1fr;
    border-bottom: 1.3px solid var(--border-color);
    height: auto;
    padding: 1.4rem 1.6rem;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 99;
}


import React, { useEffect, useState } from 'react';
import MenuLink from './MenuLink';
import Line from '../../components/Line';

import { AiOutlineBank, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { LuGlobe, LuLayoutPanelLeft, LuRotate3D, LuTags } from 'react-icons/lu';
import { FiUsers } from 'react-icons/fi';
import { MdChatBubble, MdOutlineChatBubbleOutline, MdOutlineDashboard, MdOutlineDeliveryDining, MdOutlineHelp, MdOutlineHelpOutline, MdOutlineSettings, MdOutlineShoppingBag, MdOutlineSsidChart, MdOutlineStorefront, MdOutlineWebhook } from 'react-icons/md';
import { BiCustomize, BiLineChart } from 'react-icons/bi';
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import { useDataContext } from '../../context/DataContext';
import { RiAppsLine, RiBankLine, RiCloseFill, RiCoupon3Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import Overlay from '../../components/Overlay';
import MenuButton from './MenuButton';
import { openWidget } from '../../utils/helper';
import { TbTransactionDollar, TbTruckDelivery } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';
import TooltipUI from '../../components/TooltipUI';


function DashboardMenu() {
    const [showRemains, setShowRemains] = useState(false);
    const { isMenuCollapsed, showSidemenu, handleShowSidemenu, animateOut } = useDataContext();
    const { width } = useWindowSize()
    const { pathname } = useLocation();

    function handleShowRemains() {
        setShowRemains(!showRemains)
    }


    useEffect(function() {
        if(
            pathname.includes("delivery") 
            || pathname.includes("store-information") 
            || pathname.includes("subscription")
            || pathname.includes("custom-domain")
            || pathname.includes("store-customisation")
        ) {
            setShowRemains(true);
        }
    }, [pathname]);
    

    return (
        <>
            {width > 900 && (
                <div className='dashboard--menu'>
                    <div className='menu--block'>
                        {!isMenuCollapsed && (
                            <span className='block--heading'>
                                <p className='heading--text'>Main Access</p>
                            </span>
                        )}
                        <ul className='menu--list'>
                            <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                            <MenuLink icon={<MdOutlineShoppingBag />} title='Your Orders' link='/orders' />
                            <MenuLink icon={<LuTags />} title='Your Products' link='/products' />
                            <MenuLink icon={<BiLineChart />} title='Store Analytics' link='/analytics' />
                            <MenuLink icon={<RiCoupon3Line />} title='Run sales and coupon' link='/run-sales' />
                            <MenuLink icon={<FiUsers />} title='Your Customers' link='/customers' />
                            <MenuLink icon={<TbTransactionDollar />} title='All Transactions' link='/transactions' />
                            <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                        </ul>
                    </div>

                    <div className={`menu--block settings ${showRemains ? 'menu-animate' : ''}`}>
                        <Line where={'Bottom'} value={'0.34rem'} />

                            {!isMenuCollapsed ? (
                                <span className='block--heading' onClick={handleShowRemains}>
                                    <p className='heading--text' style={{ cursor: 'pointer' }}>Store Settings</p>
                                    <div className='heading--icon'>
                                        {showRemains ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                    </div>
                                </span>
                            ) : (
                                <TooltipUI placement='right' title={showRemains ? "Show Less" : "Show More"}>
                                    <div className='heading--icon' onClick={handleShowRemains}>
                                        {showRemains ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                    </div>
                                </TooltipUI>
                            )}

                        {showRemains && (
                            <ul className={`menu--list ${showRemains ? 'menu-animate' : 'menu-unanimate'}`}>
                                <MenuLink icon={<MdOutlineStorefront />} title='Store Information' link='/store-information' />
                                <MenuLink icon={<TbTruckDelivery />} title='Delivery Rates' link='/delivery-rates' />
                                <MenuLink icon={<LuGlobe />} title='Custom Domain' link='/custom-domain' />
                                <MenuLink icon={<HiOutlineSquare3Stack3D />} title='Subscription' link='/subscription' />
                                <MenuLink icon={<BiCustomize />} title='Store Customisation' link='/store-customisation' />
                            </ul>
                        )}

                        <Line where={'Top'} value={'0.34rem'} />

                    </div>


                    <ul className={`menu--list ${!showRemains ? 'last--menu' : ''}`}>
                        <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' />
                        <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        <MenuButton icon={<MdOutlineHelpOutline />} title='Help Center'action={openWidget} />
                    </ul>
                </div>
            )}

            {(width < 900 && showSidemenu) && (
                <>
                    {width >= 600 && <Overlay handleClose={handleShowSidemenu} />}
                    <div className={`dashboard--sidemenu ${animateOut ? 'animate-out' : ''}`}>

                        <div className='menu--block'>
                            <span className='hamburger--icon' onClick={handleShowSidemenu}>
                                <RiCloseFill />
                            </span>

                            {(width < 600) && (
                                <>
                                    <a href="https://www.luxeware.quicka.store" target='_blank' className='store--btn'>
                                        View Store <MdOutlineStorefront />
                                    </a>

                                    <Line where={'Bottom'} value={'1.6rem'} />
                                </>
                            )}

                            <span className='block--heading'>
                                <p className='heading--text'>Main Access</p>
                            </span>
                            <ul className='menu--list'>
                                <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                                <MenuLink icon={<MdOutlineShoppingBag />} title='Your Orders' link='/orders' />
                                <MenuLink icon={<LuTags />} title='Your Products' link='/products' />
                                <MenuLink icon={<BiLineChart />} title='Store Analytics' link='/analytics' />
                                <MenuLink icon={<RiCoupon3Line />} title='Run sales / coupon' link='/run-sales' />
                                <MenuLink icon={<FiUsers />} title='Your Customers' link='/customers' />
                                <MenuLink icon={<TbTransactionDollar />} title='All Transactions' link='/transactions' />
                                <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                            </ul>
                        </div>

                        <div className='menu--block'>
                            <Line where={'Bottom'} value={'0.34rem'} />

                            <span className='block--heading' onClick={handleShowRemains}>
                                <p className='heading--text' style={{ cursor: 'pointer' }}>Store Settings</p>
                                <div className='heading--icon'>
                                    {showRemains ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                </div>
                            </span>

                            {showRemains && (
                                <ul className='menu--list'>
                                    <MenuLink icon={<MdOutlineStorefront />} title='Store Information' link='/store-information' />
                                    <MenuLink icon={<TbTruckDelivery />} title='Delivery Rates' link='/delivery-rates' />
                                    <MenuLink icon={<LuGlobe />} title='Custom Domain' link='/custom-domain' />
                                    <MenuLink icon={<HiOutlineSquare3Stack3D />} title='Subscription' link='/subscription' />
                                    <MenuLink icon={<BiCustomize />} title='Site Customisation' link='/store-customisation' />
                                </ul>
                            )}

                            <Line where={'Top'} value={'0.34rem'} />

                        </div>

                        <ul className={`menu--list ${!showRemains ? 'last--menu' : ''}`}>
                            <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' />
                            <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        </ul>
                    </div>
                </>
            )}

        </>
    )
}

export default DashboardMenu




















{name: "9mobile 9Payment Service Bank", slug: "9mobile-9payment-service-bank-ng", code: "120001"} 
{name: "Abbey Mortgage Bank", slug: "abbey-mortgage-bank", code: "801"} 
{name: "Above Only MFB", slug: "above-only-mfb", code: "51204"} 
{name: "Abulesoro MFB", slug: "abulesoro-mfb-ng", code: "51312"} 
{name: "Access Bank", slug: "access-bank", code: "044"} 
{name: "Access Bank (Diamond)", slug: "access-bank-diamond", code: "063"} 
{name: "Accion Microfinance Bank", slug: "accion-microfinance-bank-ng", code: "602"} 
{name: "Ahmadu Bello University Microfinance Bank", slug: "ahmadu-bello-university-microfinance-bank-ng", code: "50036"}
{name: "Airtel Smartcash PSB", slug: "airtel-smartcash-psb-ng", code: "120004"} 
{name: "AKU Microfinance Bank", slug: "aku-mfb", code: "51336"} 
{name: "ALAT by WEMA", slug: "alat-by-wema", code: "035A"} 
{name: "Amegy Microfinance Bank", slug: "amegy-microfinance-bank-ng", code: "090629"} 
{name: "Amju Unique MFB", slug: "amju-unique-mfb", code: "50926"} 
{name: "AMPERSAND MICROFINANCE BANK", slug: "ampersand-microfinance-bank-ng", code: "51341"} 
{name: "Aramoko MFB", slug: "aramoko-mfb", code: "50083"} 
{name: "ASO Savings and Loans", slug: "asosavings", code: "401"} 
{name: "Astrapolaris MFB LTD", slug: "astrapolaris-mfb", code: "MFB50094"} 
{name: "Bainescredit MFB", slug: "bainescredit-mfb", code: "51229"} 
{name: "Banc Corp Microfinance Bank", slug: "banc-corp-microfinance-bank-ng", code: "50117"} 
{name: "Bowen Microfinance Bank", slug: "bowen-microfinance-bank", code: "50931"} 
{name: "Branch International Financial Services Limited", slug: "branch", code: "FC40163"} 
{name: "Carbon", slug: "carbon", code: "565"} 
{name: "CASHCONNECT MFB", slug: "cashconnect-mfb-ng", code: "865"} 
{name: "CEMCS Microfinance Bank", slug: "cemcs-microfinance-bank", code: "50823"} 
{name: "Chanelle Microfinance Bank Limited", slug: "chanelle-microfinance-bank-limited-ng", code: "50171"} 
{name: "Chikum Microfinance bank", slug: "chikum-microfinance-bank-ng", code: "312"} 
{name: "Citibank Nigeria", slug: "citibank-nigeria", code: "023"} 
{name: "Consumer Microfinance Bank", slug: "consumer-microfinance-bank-ng", code: "50910"} 
{name: "Corestep MFB", slug: "corestep-mfb", code: "50204"} 
{name: "Coronation Merchant Bank", slug: "coronation-merchant-bank-ng", code: "559"} 
{name: "County Finance Limited", slug: "county-finance-limited", code: "FC40128"} 
{name: "Crescent MFB", slug: "crescent-mfb", code: "51297"} 
{name: "Dot Microfinance Bank", slug: "dot-microfinance-bank-ng", code: "50162"} 
{name: "Ecobank Nigeria", slug: "ecobank-nigeria", code: "050"} 
{name: "Ekimogun MFB", slug: "ekimogun-mfb-ng", code: "50263"} 
{name: "Ekondo Microfinance Bank", slug: "ekondo-microfinance-bank-ng", code: "098"} 
{name: "Eyowo", slug: "eyowo", code: "50126"} 
{name: "Fairmoney Microfinance Bank", slug: "fairmoney-microfinance-bank-ng", code: "51318"} 
{name: "Fidelity Bank", slug: "fidelity-bank", code: "070"} 
{name: "Firmus MFB", slug: "firmus-mfb", code: "51314"} 
{name: "First Bank of Nigeria", slug: "first-bank-of-nigeria", code: "011"} 
{name: "First City Monument Bank", slug: "first-city-monument-bank", code: "214"} 
{name: "FirstTrust Mortgage Bank Nigeria", slug: "firsttrust-mortgage-bank-nigeria-ng", code: "413"} 
{name: "FLOURISH MFB", slug: "flourish-mfb-ng", code: "50315"} 
{name: "FSDH Merchant Bank Limited", slug: "fsdh-merchant-bank-limited", code: "501"} 
{name: "Gateway Mortgage Bank LTD", slug: "gateway-mortgage-bank", code: "812"} 
{name: "Globus Bank", slug: "globus-bank", code: "00103"} 
{name: "GoMoney", slug: "gomoney", code: "100022"} 
{name: "Goodnews Microfinance Bank", slug: "goodnews-microfinance-bank-ng", code: "50739"} 
{name: "Greenwich Merchant Bank", slug: "greenwich-merchant-bank-ng", code: "562"} 
{name: "Guaranty Trust Bank", slug: "guaranty-trust-bank", code: "058"} 
{name: "Hackman Microfinance Bank", slug: "hackman-microfinance-bank", code: "51251"} 
{name: "Hasal Microfinance Bank", slug: "hasal-microfinance-bank", code: "50383"} 
{name: "Heritage Bank", slug: "heritage-bank", code: "030"} 
{name: "HopePSB", slug: "hopepsb-ng", code: "120002"} 
{name: "Ibile Microfinance Bank", slug: "ibile-mfb", code: "51244"} 
{name: "Ikoyi Osun MFB", slug: "ikoyi-osun-mfb", code: "50439"} 
{name: "Ilaro Poly Microfinance Bank", slug: "ilaro-poly-microfinance-bank-ng", code: "50442"} 
{name: "Imowo MFB", slug: "imowo-mfb-ng", code: "50453"} 
{name: "Infinity MFB", slug: "infinity-mfb", code: "50457"} 
{name: "Jaiz Bank", slug: "jaiz-bank", code: "301"} 
{name: "Kadpoly MFB", slug: "kadpoly-mfb", code: "50502"} 
{name: "Keystone Bank", slug: "keystone-bank", code: "082"} 
{name: "Kredi Money MFB LTD", slug: "kredi-money-mfb", code: "50200"} 
{name: "Kuda Bank", slug: "kuda-bank", code: "50211"} 
{name: "Lagos Building Investment Company Plc.", slug: "lbic-plc", code: "90052"} 
{name: "Links MFB", slug: "links-mfb", code: "50549"} 
{name: "Living Trust Mortgage Bank", slug: "living-trust-mortgage-bank", code: "031"} 
{name: "Lotus Bank", slug: "lotus-bank", code: "303"} 
{name: "Mayfair MFB", slug: "mayfair-mfb", code: "50563"} 
{name: "Mint MFB", slug: "mint-mfb", code: "50304"} 
{name: "Moniepoint MFB", slug: "moniepoint-mfb-ng", code: "50515"} 
{name: "MTN Momo PSB", slug: "mtn-momo-psb-ng", code: "120003"} 
{name: "OPay Digital Services Limited (OPay)", slug: "paycom", code: "00711"} 
{name: "Optimus Bank Limited", slug: "optimus-bank-ltd", code: "107"} 
{name: "Paga", slug: "paga", code: "100002"} 
{name: "PalmPay", slug: "palmpay", code: "999991"} 
{name: "Parallex Bank", slug: "parallex-bank", code: "104"} 
{name: "Parkway - ReadyCash", slug: "parkway-ready-cash", code: "311"} 
{name: "Paycom", slug: "paycom", code: "999992"} 
{name: "Peace Microfinance Bank", slug: "peace-microfinance-bank-ng", code: "50743"} 
{name: "Personal Trust MFB", slug: "personal-trust-mfb-ng", code: "51146"} 
{name: "Petra Mircofinance Bank Plc", slug: "petra-microfinance-bank-plc", code: "50746"} 
{name: "Platinum Mortgage Bank", slug: "platinum-mortgage-bank-ng", code: "268"} 
{name: "Polaris Bank", slug: "polaris-bank", code: "076"} 
{name: "Polyunwana MFB", slug: "polyunwana-mfb-ng", code: "50864"} 
{name: "PremiumTrust Bank", slug: "premiumtrust-bank-ng", code: "105"} 
{name: "Providus Bank", slug: "providus-bank", code: "101"} 
{name: "QuickFund MFB", slug: "quickfund-mfb", code: "51293"} 
{name: "Rand Merchant Bank", slug: "rand-merchant-bank", code: "502"} 
{name: "Refuge Mortgage Bank", slug: "refuge-mortgage-bank", code: "90067"} 
{name: "Rigo Microfinance Bank Limited", slug: "rigo-microfinance-bank-limited-ng", code: "51286"} 
{name: "ROCKSHIELD MICROFINANCE BANK", slug: "rockshield-microfinance-bank-ng", code: "50767"} 
{name: "Rubies MFB", slug: "rubies-mfb", code: "125"} 
{name: "Safe Haven MFB", slug: "safe-haven-mfb-ng", code: "51113"} 
{name: "Safe Haven Microfinance Bank Limited", slug: "safe-haven-microfinance-bank-limited-ng", code: "951113"}
{name: "SAGE GREY FINANCE LIMITED", slug: "sage-grey-finance-limited-ng", code: "40165"} 
{name: "Shield MFB", slug: "shield-mfb-ng", code: "50582"} 
{name: "Solid Allianze MFB", slug: "solid-allianze-mfb", code: "51062"} 
{name: "Solid Rock MFB", slug: "solid-rock-mfb", code: "50800"}
{name: "Sparkle Microfinance Bank", slug: "sparkle-microfinance-bank", code: "51310"}
{name: "Stanbic IBTC Bank", slug: "stanbic-ibtc-bank", code: "221"}
{name: "Standard Chartered Bank", slug: "standard-chartered-bank", code: "068"}
{name: "Stellas MFB", slug: "stellas-mfb", code: "51253"}
{name: "Sterling Bank", slug: "sterling-bank", code: "232"}
{name: "Suntrust Bank", slug: "suntrust-bank", code: "100"}
{name: "Supreme MFB", slug: "supreme-mfb-ng", code: "50968"}
{name: "TAJ Bank", slug: "taj-bank", code: "302"}
{name: "Tanadi Microfinance Bank", slug: "tanadi-microfinance-bank-ng", code: "090560"}
{name: "Tangerine Money", slug: "tangerine-money", code: "51269"}
{name: "TCF MFB", slug: "tcf-mfb", code: "51211"}
{name: "Titan Bank", slug: "titan-bank", code: "102"}
{name: "Titan Paystack", slug: "titan-paystack", code: "100039"}
{name: "U&C Microfinance Bank Ltd (U AND C MFB)", slug: "uc-microfinance-bank-ltd-u-and-c-mfb-ng", code: "50840"}
{name: "Uhuru MFB", slug: "uhuru-mfb-ng", code: "MFB51322"}
{name: "Unaab Microfinance Bank Limited", slug: "unaab-microfinance-bank-limited-ng", code: "50870"}
{name: "Unical MFB", slug: "unical-mfb", code: "50871"}
{name: "Unilag Microfinance Bank", slug: "unilag-microfinance-bank-ng", code: "51316"}
{name: "Union Bank of Nigeria", slug: "union-bank-of-nigeria", code: "032"}
{name: "United Bank For Africa", slug: "united-bank-for-africa", code: "033"}
{name: "Unity Bank", slug: "unity-bank", code: "215"}
{name: "VFD Microfinance Bank Limited", slug: "vfd", code: "566"}
{name: "Waya Microfinance Bank", slug: "waya-microfinance-bank-ng", code: "51355"}
{name: "Wema Bank", slug: "wema-bank", code: "035"}
{name: "Zenith Bank", slug: "zenith-bank", code: "057"}



"onBoard": {
    "bank": false,
    "completed": false,
    "basic_setup": true,
    "hasShipping": false,
    "payment_method": false,
    "subscription_intent": 4,
    "completed_store_info": false,
    "created_first_product": false
},


░░

{/*
<div className="form--item">
    <label className="form--label">Item Images</label>
    <input type="file" id="form-img" accept="image/*" multiple max={4} name='images' onChange={handleImageChange} />
    <label htmlFor="form-img" className='form--img-box'>
        <span className='img--container'>
            <IoCloudDownloadOutline />
            <h3>Click to upload or Drag n drop Image</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, cumque.</p>
        </span>
    </label>
</div> 
*/}









{
    "store": {
        "id": 194908,
        "user_id": 198813,
        "name": "Idowu Olatunji",
        "subdomain": "luxwares",
        "domain": null,
        "url": "luxwares.bumpa.shop",
        "previous_url": null,
        "phone": "+2349057643470",
        "message_credits": "20.00",
        "dialing_code": "+234",
        "subtitle": null,
        "description": null,
        "logo": "luxwares.png",
        "premium": false,
        "custom": 0,
        "currency": "NGN",
        "template": "bumpa",
        "address": {
            "zip": "100215",
            "city": "Lagos",
            "phone": "+2349057643470",
            "state": null,
            "street": "Block 7, Millennium Estate, Oko-oba Agege Lagos",
            "country": null
        },
        "settings": {
            "currency": "NGN",
            "charge_customer": true,
            "currency_symbol": "\u20a6",
            "payment_settings": {
                "paystack": true,
                "bank_transfer": false
            },
            "maintenance_message": "We would be back soon"
        },
        "currencies": [
            {
                "rate": "1",
                "default": true,
                "currency": "NGN",
                "base_currency": 1,
                "currency_name": "Naira",
                "currency_symbol": "\u20a6"
            }
        ],
        "meta": {
            "medium": null,
            "source": null,
            "onBoard": {
                "bank": true,
                "completed": true,
                "basic_setup": true,
                "hasShipping": true,
                "payment_method": true,
                "subscription_intent": 4,
                "completed_store_info": true,
                "created_first_product": true
            },
            "have_staff": null,
            "new_business": null,
            "staff_number": "1-2",
            "sell_in_naira": null,
            "has_customized": true,
            "physical_store": "No",
            "business_sector": "fashion",
            "orders_per_week": "0-10",
            "number_of_stores": "0",
            "products_in_stock": null,
            "reason_for_starting": null,
            "reason_for_starting_array": [
                "website_run_sales",
                "manage_staff_terminal",
                "invoices_receipts"
            ]
        },
        "created_at": "2024-09-09T08:41:33.000000Z",
        "updated_at": "2024-10-29T21:34:35.000000Z",
        "paystack_id": null,
        "paystack_code": null,
        "card_brand": null,
        "card_last_four": null,
        "trial_ends_at": null,
        "country_id": 160,
        "tx_fee": "0.00",
        "suspended": 0,
        "referral_code": "luxware907",
        "flag": null,
        "online": 1,
        "sender_id": null,
        "deleted_at": null,
        "store_category_id": null,
        "business_category": null,
        "default_location_id": 195192,
        "nbc": 0,
        "nbc_locations": null,
        "popup": 0,
        "popup_locations": null,
        "cac": null,
        "cac_type": null,
        "business_name": "luxwares",
        "cac_image": null,
        "cac_verified_at": null,
        "image_path": "https:\/\/salescabal.s3.eu-west-3.amazonaws.com\/stores\/194908\/",
        "address_formatted": "Block 7, Millennium Estate, Oko-oba Agege Lagos, Lagos, , . 100215",
        "logo_url": "https:\/\/salescabal.s3.eu-west-3.amazonaws.com\/stores\/194908\/luxwares.png",
        "url_link": "https:\/\/luxwares.bumpa.shop",
        "meta_description": "Idowu Olatunji.  -- Powered by Bumpa!",
        "login_url": "https:\/\/web.getbumpa.com\/customer\/login\/eyJpdiI6ImhkNzNDdjg5L0E3VWJLb3JZTFgrR3c9PSIsInZhbHVlIjoibW1LWDRnREtHZktGb0ZleGFMdk9VZz09IiwibWFjIjoiMmVlMTFhMmE1ZTBlYjhlNmNhMjE4YjhmYjA4MTExMGYwM2UxZWU0Y2E1YTc4OWFlZWI0ZjM5MjU3OWYwM2ZlOSIsInRhZyI6IiJ9",
        "registration_url": "https:\/\/web.getbumpa.com\/customer\/register\/eyJpdiI6IlVVVnBBbkl1Y2V1bC9vcFFzbFgyN2c9PSIsInZhbHVlIjoiR2JYd1pQYlRYZE0yOGoyaGxKSXE2QT09IiwibWFjIjoiMTA0NzljMWRiZGZiODJjN2EwYzVmYTQxZWE5ODU2MDEyMDJlNmE2YzFkOGUxODNjNTQ3MzhjZGFmOTcyMjdjMCIsInRhZyI6IiJ9",
        "subscription": [
            {
                "id": 192286,
                "store_id": 194908,
                "interval": "monthly",
                "amount": "0.0000",
                "start_date": "2024-09-09 09:41:33",
                "ends_at": "2034-09-09 09:41:33",
                "status": "success",
                "is_addon": 0,
                "channel": "card",
                "cancelled_at": null,
                "plan_id": 2,
                "type": null,
                "created_at": "2024-09-09T08:41:33.000000Z",
                "updated_at": "2024-09-09T08:41:33.000000Z",
                "has_subscribed": false,
                "has_activated_trial": false,
                "grace_period_ends_at": "2034-09-12T08:41:33.000000Z",
                "remaining_amount": 0,
                "plan": {
                    "id": 2,
                    "name": "Bumpa Basic",
                    "plan_code": "BMP_0b2ce11ce7",
                    "interval": "monthly",
                    "description": "For new businesses",
                    "status": "active",
                    "amount": "0.0000",
                    "initial_amount": "0.0000",
                    "currency": "NGN",
                    "is_trial": 0,
                    "is_addon": 0,
                    "type": "free",
                    "slug": "free",
                    "hierarchy": 0,
                    "features": [
                        "1 template business website.",
                        "Can purchase custom domain",
                        "Free SSL Certificate",
                        "Add & manage 25 SKUs(products + variants)",
                        "Unlimited sales records.",
                        "Create 30 invoices\/receipts ",
                        "Unlimited discounts & coupons",
                        "Online payment gateway (1.5% transaction charge)",
                        "Bumpa Wallet",
                        "Bumpa Terminal",
                        "Naira only payments",
                        "25 messaging credits monthly",
                        "Unlimited customer records",
                        "Default customer groups (5)",
                        "Limited Business Analytics",
                        "Unlimited expense records",
                        "1 store location",
                        "Email\/In App Support"
                    ],
                    "created_at": null,
                    "updated_at": null
                }
            }
        ],
        "terminal": null
    },
    "wrap": []
}



navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
});




    const handleFetchError = function(errMessage) {
        let message;
        if (errMessage?.includes("Failed to fetch") || errMessage?.includes("CONNECTION")) {
            message = "Oops! Connection Error!!, Please try again later.";
        } else if (errMessage?.includes("Internet Error")) {
            message = "Unable to fetch, Check Internet Connection.";
        } else {
            message = errMessage || "An error occurred. Please try again later";
        }
        return message;
    }



useEffect(function () {
    document.title = "Quicka | Your orders";

    // if (orders?.length < 1 && error.order) {
    //     handleFetchUserStoreOrders();
    // }
}, []);