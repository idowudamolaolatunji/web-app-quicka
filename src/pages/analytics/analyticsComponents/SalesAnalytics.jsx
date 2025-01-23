import React from 'react'
import VisitorOverview from '../../home/homeComponents/VisitorOverview'

function SalesAnalytics({ dateRange }) {
  return (
    <div className='analytics--grid grid--2x1'>
      <VisitorOverview />
      <VisitorOverview />
    </div>
  )
}

export default SalesAnalytics
