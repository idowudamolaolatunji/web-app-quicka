import React from 'react'
import Overlay from '../Overlay'


function ExtraSmall({ children, handleClose }) {

    return (
        <>
            <Overlay handleClose={handleClose} />
            <div className="modal mini">
                {children}
            </div>
        </>
    )
}

export default ExtraSmall