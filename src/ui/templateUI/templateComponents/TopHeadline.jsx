import React from 'react'

function TopHeadline({ headline, color }) {
  return (
    <div className='template__headline' style={{ backgroundColor: color }}>
        <p>{headline || "Lorem ipsum dolor sit amet."}</p>
    </div>
  )
}

export default TopHeadline