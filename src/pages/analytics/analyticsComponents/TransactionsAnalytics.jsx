import React from 'react'
import VisitorOverview from '../../home/homeComponents/VisitorOverview'

function TransactionsAnalytics({ dateRange }) {
  return (
    <div className='analytics--grid grid--1x1'>
      <VisitorOverview />
      <VisitorOverview />
      <VisitorOverview />
      <VisitorOverview />
    </div>
  )
}

export default TransactionsAnalytics
