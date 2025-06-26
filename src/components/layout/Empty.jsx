import React from 'react';
import empty from '../../assets/images/resources/orange-charts-and-calculations-for-business-analytics-1.png'


export default function Empty({ customStyle, text, img=null }) {
  return (
    <div className="empty--box" style={customStyle}>
        <img src={img || empty} alt='empty image' />
        <p>No {text}</p>
    </div>
  )
}