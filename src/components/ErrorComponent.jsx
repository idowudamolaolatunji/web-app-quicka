import React from 'react';

import empty from '../assets/images/resources/orange-error.png'

function ErrorComponent({ customStyle, text }) {
  console.log(customStyle)
  return (
    <div className="empty--box" style={{ padding: "4.8rem 2rem", ...customStyle }}>
        <img src={empty} alt='' />
        <p>{text}</p>
    </div>
  )
}

export default ErrorComponent