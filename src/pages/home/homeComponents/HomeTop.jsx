import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExpression, getGreeting, todayDate } from '../../../utils/helper';
import { useWindowSize } from 'react-use';
import { MdOutlineClose, MdOutlineWorkspacePremium } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { LuCheckCircle } from 'react-icons/lu';
import moment from 'moment';
import { useDataContext } from '../../../context/DataContext';


/* 
    Remember a few things here, free trails will not be there every time as the user might have accessed it the year before and the subscription expires.
*/

function HomeTop() {
    const navigate = useNavigate();
    const { user, store } = useAuthContext();
    const { offer_trail, free_trails  } = useDataContext();
    const { welcomePackage, subscription, storeOnboardCompleted } = store;

    const [showSub, setShowSub] = useState(true);

    const daysToReach = function() {
        const createdAtMoment = moment(welcomePackage?.startDate);
        // Calculate remainingDates to end offer from createdAt date
        const daysRemaining = createdAtMoment.clone().add(welcomePackage?.offer_tenue, 'days').diff(moment(), 'days');
        return daysRemaining;
    }
    
    return (
        <React.Fragment>
            {/* {(!welcomePackage && subscription?.type == "free" && showSub) && ( */}
            {(subscription?.type == "free" && showSub) && (
                <div className='home--sub'>
                    {daysToReach() >= 1 ? (
                        <React.Fragment>
                            <div className="sub--mini">
                                <span className='sub--text'>
                                    Select any plan and get your first year at a whooping
                                    {" "}
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif" alt="🥳" width="20" height="20" />
                                    </picture>
                                    {" "}
                                    <span className='value' style={{ fontSize: '1.6rem' }}>{welcomePackage?.offer_percent}</span>% discount <span className='value'>+ {offer_trail}</span> days free!
                                    <p className='sub--text-sub'>Promo offer expires in <span className='value'>{daysToReach()}</span> day{daysToReach() < 2 ? "" : "s"}.</p>
                                </span>
                                <RiDiscountPercentFill style={{ fontSize: '2.6rem' }} />
                            </div>

                            <div className="sub--mini" style={{ gap: '2rem' }}>
                                <button onClick={() => navigate('/dashboard/subscription/choose-plan?option=offer')}className='sub--btn'>Get Your Discount!</button>
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
                                <button onClick={() => navigate('/dashboard/subscription/choose-plan?option=trail')}className='sub--btn'>Try <span className="value">{free_trails}</span> days free trial</button>
                                <MdOutlineClose style={{ fontSize: '2.4rem', cursor: 'pointer' }} onClick={() => setShowSub(false)} /> 
                            </div>
                        </React.Fragment>
                    )}
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
                </div>

                {(subscription?.type == "free" && !showSub) && (
                    <p className='upgrade--link' onClick={() => navigate('/dashboard/subscription')}>
                        <LuCheckCircle />Your account is currently on the free plan.
                    </p>
                )}

                {(subscription?.type !== "free" && !showSub) && (
                    <p className='upgrade--link premium' style={{ backgroundPosition: "right", backgroundSize: "80rem", fontWeight: "600", fontSize: "1.3rem" }}>
                        <MdOutlineWorkspacePremium style={{ fontSize: "2rem" }} />Premium Account.
                        {/* <MdOutlineWorkspacePremium style={{ fontSize: "2rem", color: "#FFD700" }} />Premium Account. */}
                    </p>
                )}
            </div>
        </React.Fragment>
    );
}

export default HomeTop