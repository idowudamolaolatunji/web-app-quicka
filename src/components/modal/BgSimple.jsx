import React from 'react'
import Overlay from '../Overlay'
import { AiOutlineClose } from 'react-icons/ai'

function BgSimple({ setClose, children }) {

    function handleClose() {
        setClose(false)
    }

  return (
    <>
        <Overlay handleClose={handleClose}/>
        <div className='simple bg-simple modal'>
            <span className='icon--box' onClick={handleClose}><AiOutlineClose /></span>
            {children}
        </div>
    </>
  )
}

export default BgSimple