import React from 'react'

function CopyrightText({ customStyle, white=false }) {
  return (
    <p className='copyright--text' style={customStyle}>
      &copy; Quicka Inc 
      <img src={white ? "../../fav-icon.png" : "../../favicon.png"} /> 2024, All right reserved.
    </p>
  )
}

export default CopyrightText