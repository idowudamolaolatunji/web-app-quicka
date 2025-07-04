import React from 'react'
import VisitorOverview from '../../home/homeComponents/VisitorOverview'
import SalesOverview from '../analyticsComponents/SalesOverview'

function SalesAnalytics({ dateRange }) {
  return (
    <div className='analytics--grid grid--2x1'>
      <div className="left--side">
        <SalesOverview period={dateRange} />
      </div>

      <div className="right--side">
        <VisitorOverview />
      </div>
    </div>
  )
}

export default SalesAnalytics
