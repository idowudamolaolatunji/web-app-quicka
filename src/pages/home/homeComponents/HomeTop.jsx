import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExpression, getGreeting, todayDate } from '../../../utils/helper';
import { useWindowSize } from 'react-use';
import { MdOutlineClose, MdOutlineWorkspacePremium } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { LuCheckCircle } from 'react-icons/lu';
import moment from 'moment';



function HomeTop() {
    const offer_tenue = 30;
    const offer_percent = 30;
    const navigate = useNavigate();
    const { user, store } = useAuthContext();

    const [showSub, setShowSub] = useState(true);

    const daysToReach = function() {
        const createdAtMoment = moment(user?.createdAt);
    
        // Calculate remainingDates to end offer from createdAt date
        const daysRemaining = createdAtMoment.clone().add(offer_tenue, 'days').diff(moment(), 'days');
        return daysRemaining;
    }

    const remaining = daysToReach();
    
    return (
        <React.Fragment>
            {(store?.subscriptionType == "free" && showSub) && (
                <div className='home--sub' style={{ border: "1px solid red"}}>
                    {remaining >= 1 ? (
                        <React.Fragment>
                            <div className="sub--mini">
                                <span className='sub--text'>
                                    {/* Select any plan and get your first year at a whooping 🥳 <span className='value' style={{ fontSize: '1.6rem' }}>{offer_percent}</span>% discount! */}
                                    Select any plan and get your first year at a whooping
                                    {" "}
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif" alt="🥳" width="20" height="20" />
                                    </picture>
                                    {" "}
                                    <span className='value' style={{ fontSize: '1.6rem' }}>{offer_percent}</span>% discount!
                                    <p className='sub--text-sub'>Promo offer expires in <span className='value'>{remaining}</span> day{remaining < 2 ? "" : "s"}.</p>
                                </span>
                                <RiDiscountPercentFill style={{ fontSize: '2.6rem' }} />
                            </div>

                            <div className="sub--mini" style={{ gap: '2rem' }}>
                                <button onClick={() => navigate('/dashboard/subscription/trail')}className='sub--btn'>Try <span className="value">7</span> days free trial</button>
                                <MdOutlineClose style={{ fontSize: '2.4rem', cursor: 'pointer' }} onClick={() => setShowSub(false)} /> 
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="sub--mini">
                                <span className='sub--text'>
                                    Want to experience more
                                    {" "}
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="20" height="20" />
                                    </picture>
                                    {" "}
                                    exclusive features?
                                    <p className='sub--text-sub'>Upgrade to premium, and Cancel anytime</p>
                                </span>
                            </div>

                            <div className="sub--mini" style={{ gap: '2rem' }}>
                                <button onClick={() => navigate('/dashboard/subscription/full')}className='sub--btn'>Choose a plan</button>
                                <MdOutlineClose style={{ fontSize: '2.4rem', cursor: 'pointer' }} onClick={() => setShowSub(false)} /> 
                            </div>
                        </React.Fragment>
                    )}

                    {/* <div className="dots dots-container">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div> */}
                </div>
            )}


            <div className='home--top'>
                <div className='top--heading'>
                    {(store?.storeOnboardCompleted) ? (
                        <p className='heading--name'>{getGreeting()},{" "}{user.firstname}! {getExpression()}</p>
                    ) : (
                        <p className='heading--name'>Welcome Back, {user.firstname}! 👋🏿</p>
                    )}
                    <p className='heading--date'>Today is {todayDate()}.</p>
                </div>

                {(store?.subscriptionType == "free" && !showSub) && (
                    <p className='upgrade--link' onClick={() => navigate('/dashboard/subscription')}>
                        <LuCheckCircle />Your account is currently on the free plan.
                    </p>
                )}
            </div>
        </React.Fragment>
    );
}

export default HomeTop