import React from 'react'
import { HiMiniArrowTrendingDown, HiMiniArrowTrendingUp } from 'react-icons/hi2'
import { formatNumber } from '../../../utils/helper'
import { useAuthContext } from '../../../context/AuthContext';
import { useDataContext } from '../../../context/DataContext';

function HomeProgressCard({ title, icon, value, upTrend, percent, days }) {
    const { store } = useAuthContext();
    const { homeInsightPeriod } = useDataContext();
    const currency = store?.currency?.symbol;
    const period = homeInsightPeriod == "today" ? "day" : homeInsightPeriod?.replace("this-", "");

  return (
    <figure className='prog-figure'>
        <div className="prog-figure-top">
            <div className="prog-figure-icon">
                {icon}
            </div>
            <p className='prog-figure-title'>{title}</p>
        </div>

        <div className='prog-figure-bottom'>
            <span className='prog-figure-value'>{currency}{formatNumber(value, 2)}</span>
            <div className='prog-figure-info'>
                <span className='prog-figure-chart' style={ upTrend ? { color: 'green' } : { color: 'red' } }>
                    {upTrend ? <HiMiniArrowTrendingUp /> : <HiMiniArrowTrendingDown />}
                    
                    <p>{percent !== 0 && (upTrend ? '+' : '-')}{Math.abs(percent).toFixed(0)}%</p>
                </span>
                <p className='prog-figure-detail'>vs last {days} {period}</p>
            </div>
        </div>
    </figure>
  )
}

export default HomeProgressCard