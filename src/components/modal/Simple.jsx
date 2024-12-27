import React from 'react'
import Overlay from '../layout/Overlay'

function Simple({ title, icon, setClose, children }) {

    function handleClose() {
        setClose(false)
    }

  return (
    <>
        <Overlay handleClose={handleClose}/>
        <div className='simple modal'>
            <div className="modal--head">
                <h3>{title}</h3>
                <span onClick={handleClose}>{icon}</span>
            </div>
            {children}
        </div>
    </>
  )
}

export default Simple