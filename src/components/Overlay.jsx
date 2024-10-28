import React from 'react'

function Overlay({ handleClose, custom }) {
  return (
    <div className='global--overlay' style={custom} onClick={handleClose}>&nbsp;</div>
  )
}

export default Overlay
