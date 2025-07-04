import React from 'react'
import VisitorOverview from '../../home/homeComponents/VisitorOverview'

function CampaignsAnalytics({ dateRange }) {
  return (
    <div className='analytics--grid grid--1x1'>
      <VisitorOverview />
      <VisitorOverview />
    </div>
  )
}

export default CampaignsAnalytics
