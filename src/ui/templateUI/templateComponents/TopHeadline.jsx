import React from 'react'

function TopHeadline({ headline, color }) {
  return (
    <div className='template__headline' style={{ backgroundColor: color }}>
        <p>{headline || "Website headline goes here.."}</p>
    </div>
  )
}

export default TopHeadline