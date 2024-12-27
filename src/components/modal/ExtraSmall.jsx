import React from 'react'
import Overlay from '../layout/Overlay'


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