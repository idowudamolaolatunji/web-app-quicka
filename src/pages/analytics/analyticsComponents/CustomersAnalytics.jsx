import React from 'react'
import VisitorOverview from '../../home/homeComponents/VisitorOverview'

function CustomersAnalytics({ dateRange }) {
  return (
    <div className='analytics--grid grid--1x1'>
      <VisitorOverview />
    </div>
  )
}

export default CustomersAnalytics
