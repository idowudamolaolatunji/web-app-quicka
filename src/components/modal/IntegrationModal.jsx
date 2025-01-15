import React from 'react'
import Overlay from '../layout/Overlay'
import { AiOutlineClose } from 'react-icons/ai'

function IntegrationModal({ children, setClose, customClass }) {
    function handleClose() {
        setClose(false)
    }

  return (
    <>
        <Overlay handleClose={handleClose}/>
        <div className={`modal integrated ${customClass}`}>
            <span className='icon--box' onClick={handleClose}><AiOutlineClose /></span>
            {children}
        </div>
    </>
  )
}

export default IntegrationModal