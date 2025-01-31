import React from 'react'
import darkFav from "../../assets/images/logo/favicon_small.png"
import lightFav from "../../assets/images/logo/favicon_small_white.png"


function CopyrightText({ customStyle, darkLogo=true }) {
  return (
    <p className='copyright--text' style={customStyle}>
      &copy; Quicka Inc 
      <img src={darkLogo ? darkFav : lightFav } /> 2024, All right reserved.
    </p>
  )
}

export default CopyrightText