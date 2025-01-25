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
    const offer_percent = 35;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { storeOnboardCompleted, subscriptionType } = store;

    const [showSub, setShowSub] = useState(true);

    const daysToReach = function() {
        const createdAtMoment = moment(user?.createdAt);
    
        // Calculate remainingDates to end offer from createdAt date
        const daysRemaining = createdAtMoment.clone().add(offer_tenue, 'days').diff(moment(), 'days');
        return daysRemaining;
    }

    const remaining = daysToReach();
    
    return (
        <>
            {(subscriptionType == "free" && showSub) && (
                <div className='home--sub'>

                    {remaining >= 1 ? (
                        <div className="sub--mini">
                            <span className='sub--text'>
                                Select a plan and get your first year at a whooping 🥳 <span className='value' style={{ fontSize: '1.6rem' }}>{offer_percent}</span>% discount!
                                <p className='sub--text-sub'>Promo offer expires in <span className='value'>{remaining}</span> day{remaining < 2 ? "" : "s"}.</p>
                            </span>
                            <RiDiscountPercentFill style={{ fontSize: '2.6rem' }} />
                        </div>
                    ) : (
                        <div className="sub--mini">
                            <span className='sub--text'>
                                Want to experience more exclusive features?
                                <p className='sub--text-sub'>Upgrade to premium, and Cancel anytime</p>
                            </span>
                        </div>
                    )}

                    <div className="sub--mini" style={{ gap: '2rem' }}>
                        <button onClick={() => navigate('/dashboard/subscription')}className='sub--btn'>Try <span className="value">7</span> days free trial</button>
                        <MdOutlineClose style={{ fontSize: '2.4rem', cursor: 'pointer' }} onClick={() => setShowSub(false)} /> 
                    </div>
                </div>
            )}


            <div className='home--top'>
                <div className='top--heading'>
                    {(storeOnboardCompleted) ? (
                        <p className='heading--name'>{getGreeting()},{" "}{user.firstname}! {getExpression()}</p>
                    ) : (
                        <p className='heading--name'>Welcome Back, {user.firstname}! 👋🏿</p>
                    )}
                    <p className='heading--date'>{todayDate()}.</p>
                </div>


                
                {(width > 650 && subscriptionType == "free" && !showSub) && (
                    <div className='top--upgrade'>
                        <p className='upgrade--text'>Your account is currently on the free plan.</p>
                        <Link to='/dashboard/subscription' className='upgrade--link'><LuCheckCircle />Upgrade</Link>
                    </div>
                )}

                {(width <= 650 && subscriptionType == "free" && !showSub) && (
                    <p className='upgrade--link' onClick={() => navigate('/dashboard/subscription')}><LuCheckCircle />Your account is currently on the free plan.</p>
                )}
            </div>
        </>
    )
}

export default HomeTop