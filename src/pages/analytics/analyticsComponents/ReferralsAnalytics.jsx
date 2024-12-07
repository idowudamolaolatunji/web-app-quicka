import React from 'react'
import VisitorOverview from '../../home/homeComponents/VisitorOverview'

function ReferralsAnalytics({ dateRange }) {
  return (
    <div className='analytics--grid grid--2x1'>
      <VisitorOverview />
      <VisitorOverview />
      <VisitorOverview />
    </div>
  )
}

export default ReferralsAnalytics
