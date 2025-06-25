import React from 'react'
// import darkFav from "../../assets/images/logo/favicon_small.png"
// import lightFav from "../../assets/images/logo/favicon_small_white.png"
import moment from "moment"

export default function CopyrightText({ customStyle, darkLogo=true }) {
  return (
    <p className='copyright--text' style={customStyle}>
      &copy; Scale-up Solutions Ltd. {moment().year()}, All right reserved.
      {/* <img src={darkLogo ? darkFav : lightFav } /> 2025, All right reserved. */}
    </p>
  )
}