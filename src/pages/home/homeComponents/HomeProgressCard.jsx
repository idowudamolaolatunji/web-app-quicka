import React from 'react'
import { HiMiniArrowTrendingDown, HiMiniArrowTrendingUp } from 'react-icons/hi2'
import { formatNumber } from '../../../utils/helper'

function HomeProgressCard({ title, icon, value, upTrend, percent, days }) {
  return (
    <figure className='prog-figure'>
        <div className="prog-figure-top">
            <div className="prog-figure-icon">
                {icon}
            </div>
            <p className='prog-figure-title'>{title}</p>
        </div>

        <div className='prog-figure-bottom'>
            <span className='prog-figure-value'>₦{formatNumber(value, 2)}</span>
            <div className='prog-figure-info'>
                <span className='prog-figure-chart' style={ upTrend ? { color: 'green' } : { color: 'red' } }>
                    {upTrend ? <HiMiniArrowTrendingUp /> : <HiMiniArrowTrendingDown />}
                    
                    <p>{percent !== 0 && (upTrend ? '+' : '-')}{Math.abs(percent).toFixed(0)}%</p>
                </span>
                <p className='prog-figure-detail'>vs last {days} days</p>
            </div>
        </div>
    </figure>
  )
}

export default HomeProgressCard