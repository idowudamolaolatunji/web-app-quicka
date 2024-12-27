import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';

import { MdArrowBackIosNew } from 'react-icons/md';
import logo_black from '../../assets/images/logo/logo-black.png'
import logo_white from '../../assets/images/logo/logo-white.png'
import CopyrightText from '../../components/elements/CopyrightText';
import AuthUserRating from '../../components/layout/AuthUserRating';
import CustomAlert from '../../components/layout/CustomAlert';
import Spinner from '../../components/spinner/spinner_two'

import './auth.css'
import 'react-phone-input-2/lib/style.css'



function index({
    heading, backText, backLink, dataimg, response, loading,
    centered = true, overflowLeft = false, children, extras
}) {

    const { width } = useWindowSize();

    const style = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url(${dataimg})`,
        ...extras
    }

    useEffect(function () {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            {(response?.message || response?.status) && (
                <CustomAlert type={response?.status} message={response?.message} />
            )}

            {loading && <Spinner />}


            <section className='auth__section'>
                <div className="auth--left" style={overflowLeft ? { overflowY: 'auto' } : {}}>
                    <div className='auth--left-top'>
                        {width <= 850 && (
                            <div className="auth--logo">
                                <img src={logo_black} alt="quicka logo" />
                            </div>
                        )}

                        {backLink.startsWith('https://') ? (
                            <a href={backLink} className='auth--left-link'>
                                <MdArrowBackIosNew />
                                <p>{backText}</p>
                            </a>
                        ) : (
                            <Link to={backLink} className='auth--left-link'>
                                <MdArrowBackIosNew />
                                <p>{backText}</p>
                            </Link>
                        )}
                    </div>

                    <div className={`auth--left-container ${centered ? 'centered' : ''}`}>
                        {children}
                    </div>

                    {/* { width < 850 && <CopyrightText customStyle={{ justifyContent: "center", paddingTop: centered ? "2rem" : "" }} />} */}
                    {width < 850 && <CopyrightText customStyle={{ justifyContent: "center" }} />}
                </div>

                <div className="auth--right" style={style}>
                    <div className="auth--logo">
                        <img src={logo_white} alt="quicka logo" />
                    </div>
                    <h3 className="auth--right-heading">{heading}</h3>
                    <p className='auth--right-text'>Take Control, Grow, Manage, market, and succeed with easy-to-use tools designed for entrepreneurs like you. Trusted by 100+ businesses</p>

                    <AuthUserRating />

                    <CopyrightText white customStyle={{ justifyContent: "flex-start", paddingTop: "1.4rem", color: "#fff" }} />
                </div>
            </section>
        </>
    )
}

export default index;