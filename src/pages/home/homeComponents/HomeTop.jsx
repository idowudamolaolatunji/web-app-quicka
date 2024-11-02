import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExpression, getGreeting, todayDate } from '../../../utils/helper';
import { TiStarburstOutline } from 'react-icons/ti';
import { useWindowSize } from 'react-use';
import { MdOutlineClose, MdOutlineWorkspacePremium } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { AiOutlineClose } from 'react-icons/ai';
import { LuCheckCircle } from 'react-icons/lu';
import moment from 'moment';


function HomeTop() {
    const offer_tenue = 60;
    const offer_percent = 70;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { storeBasicSetup, storeFinalSetup } = user;

    const [showSub, setShowSub] = useState(true);

    const daysToReach = function() {
        const createdAtMoment = moment(user?.createdAt)
    
        // Calculate remainingDates to end offer from createdAt date
        const daysRemaining = createdAtMoment.clone().add(offer_tenue, 'days').diff(moment(), 'days');
        return daysRemaining;
    }
    
    return (

        <>
            {(!store.isPremium && showSub) && (
                <div className='home--sub'>
                    <div className="sub--mini">
                        <p className='sub--text'>
                            Select a plan and get your first year at a whooping 🥳 <span className='value' style={{ fontSize: '1.6rem' }}>{offer_percent}</span>% discount!
                            <p className='sub--text-sub'>Promo offer expired in <span className='value'>{daysToReach()}</span> day{daysToReach() < 2 ? "" : "s"}.</p>
                        </p>
                        <RiDiscountPercentFill style={{ fontSize: '2.6rem' }} />
                    </div>

                    <div className="sub--mini" style={{ gap: '2rem' }}>
                        <button onClick={() => navigate('/dashboard/subscription')}className='sub--btn'>Select a plan</button>
                        <MdOutlineClose style={{ fontSize: '2.4rem', cursor: 'pointer' }} onClick={() => setShowSub(false)} /> 
                    </div>
                </div>
            )}


            <div className='home--top'>
                <div className='top--heading'>
                    {(storeBasicSetup && storeFinalSetup) ? (
                        <p className='heading--name'>{getGreeting()},{" "}{user.firstname}! {getExpression()}</p>
                    ) : (
                        <p className='heading--name'>Welcome Back, {user.firstname}! 👋🏿</p>
                    )}
                    <p className='heading--date'>{todayDate()}.</p>
                </div>


                
                {(width > 650 && !store.isPremium && !showSub) && (
                    <div className='top--upgrade'>
                        <p className='upgrade--text'>Your account is currently on the free plan.</p>
                        <Link to='/dashboard/subscription' className='upgrade--link'><LuCheckCircle />Upgrade</Link>
                    </div>
                )}

                {(width <= 650 && !store.isPremium && !showSub) && (
                    <p className='upgrade--link' onClick={() => navigate('/dashboard/subscription')}><LuCheckCircle />Your account is currently on the free plan.</p>
                )}
            </div>
        </>
    )
}

export default HomeTop