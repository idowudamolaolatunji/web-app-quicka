import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from "react-use"
import { cap1stLetter, getExpression, getGreeting, todayDate } from '../../../utils/helper';
import { MdOutlineClose, MdOutlineWorkspacePremium } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext';
import { LuCheckCircle } from 'react-icons/lu';
import { useDataContext } from '../../../context/DataContext';
import IntialsImage from '../../../components/layout/IntialsImage';
import { truncateString } from '../../../utils/helper';
import { RiProgress1Line, RiVerifiedBadgeLine } from 'react-icons/ri';
import { VscVmActive } from "react-icons/vsc";
import { TiInputChecked } from "react-icons/ti";


export default function HomeTop() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { free_trails  } = useDataContext();
    const { subscription, storeOnboardCompleted } = store;

    const [showSub, setShowSub] = useState(true);
    
    return (
        <React.Fragment>
            {(subscription?.type == "free" && showSub) && (
                <div className='home--sub'>
                    <React.Fragment>
                        <div className="sub--mini">
                            <span className='sub--text'>
                                Want to experience more
                                {" "}
                                <picture>
                                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp" type="image/webp" />
                                    <img style={{ marginBottom: "-.4rem" }} src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif" alt="🥳" width="20" height="20" />
                                </picture>
                                {" "}
                                exclusive features?
                                <p className='sub--text-sub'>Upgrade to premium, and Cancel anytime</p>
                            </span>
                        </div>

                        <div className="sub--mini" style={{ gap: '2rem' }}>
                            <button onClick={() => navigate('/dashboard/subscription/choose-plan?option=trail')}className='sub--btn'>Try <span className="value">{free_trails}</span> days free trial</button>
                            <MdOutlineClose style={{ fontSize: '2.4rem', cursor: 'pointer' }} onClick={() => setShowSub(false)} /> 
                        </div>
                    </React.Fragment>
                </div>
            )}

            <div className='home--top'>
                <div className='top--heading'>
                    {(storeOnboardCompleted) ? (
                        <p className='heading--name'>{getGreeting()},{" "}{user.firstname}! {getExpression()}</p>
                    ) : (
                        <p className='heading--name'>Welcome Back, {user.firstname}! 👋🏿</p>
                    )}
                    <p className='heading--date'>Today is {todayDate()}.</p>

                    {(width <= 900) && (
                        <div className="menu--store" style={{ margin: 0, marginTop: ".48rem", flexWrap: "wrap" }}>
                            <IntialsImage type="store" store={store} />

                            <span className="menu--store-detail">
                                <p className='text'>{truncateString(store?.name, 22)} {storeOnboardCompleted && (<span className='status active'>Active <RiVerifiedBadgeLine /></span>)}</p>
                                {storeOnboardCompleted ? (
                                    <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn' style={{ marginTop: ".1rem" }}>
                                        {truncateString(store?.storeUrl, 25)}
                                    </a>
                                ) : (
                                    <span className='menu--onboard'>
                                        <p className='text'>Onboarding</p>
                                        <p className='status progress'>In progress <RiProgress1Line /></p>
                                    </span>
                                )}
                            </span>

                            {(subscription?.type == "paid" && width <= 650 && storeOnboardCompleted) && (
                                <p className='upgrade--link premium'>
                                    <MdOutlineWorkspacePremium />Premium
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {(subscription?.type == "free" && !showSub) && (
                    <p className='upgrade--link' onClick={() => navigate('/dashboard/subscription')}>
                        <LuCheckCircle />Your account is currently on the free plan.
                    </p>
                )}

                {(subscription?.type == "paid" && width > 650 && storeOnboardCompleted) && (
                    <p className='upgrade--link premium' style={{ backgroundPosition: "right", backgroundSize: "80rem", fontWeight: "600", fontSize: "1.3rem", cursor: "auto" }}>
                        <MdOutlineWorkspacePremium style={{ fontSize: "2rem" }} />Premium Account.
                    </p>
                )}
            </div>
        </React.Fragment>
    );
}