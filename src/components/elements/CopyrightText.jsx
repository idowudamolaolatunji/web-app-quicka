import React from 'react'
import favicon from "../../assets/images/logo/faviconB.png"

function CopyrightText({ customStyle }) {
  return (
    <p className='copyright--text' style={customStyle}>
      &copy; Quicka Inc 
      <img src={favicon} /> 2024, All right reserved.
    </p>
  )
}

export default CopyrightText