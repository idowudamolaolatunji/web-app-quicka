import React from 'react';

import empty from '../assets/images/resources/orange-error.png'

function ErrorComponent({ customStyle, text }) {
  console.log(customStyle)
  return (
    <div className="error empty--box" style={customStyle}>
        <img src={empty} alt='' />
        <p>{text}</p>
    </div>
  )
}

export default ErrorComponent