import React from 'react'
import Overlay from '../layout/Overlay'

export default function SimpleModal({ title, icon, setClose, children, customstyle }) {

    function handleClose() {
        setClose(false)
    }

  return (
    <>
        <Overlay handleClose={handleClose}/>
        <div className='simple modal' style={customstyle}>
            <div className="modal--head">
                <h3>{title}</h3>
                {icon && <span className='icon--box' onClick={handleClose}>{icon}</span>}
            </div>
            {children}
        </div>
    </>
  )
}