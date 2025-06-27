import React from 'react'
import Overlay from '../layout/Overlay'
import BackButton from '../button/BackButton'
import Line from '../elements/Line'

function Drawer({ title, children, setClose, iconType }) {

    function handleClose() {
        setClose(false)
    }

    return (
        <>
            <Overlay handleClose={handleClose} />
            <div className="drawer--modal">
                <div className="drawer--head">
                    <span className='flex' style={{ flexDirection: "row", alignItems: "center" }}>
                        <BackButton close={handleClose} iconType={iconType} />
                        <h3 className="page__section--title" style={{ width: "100%" }}>{title}</h3>
                    </span>

                    <Line border={1.4} where="Top" value="1.8rem" />
                </div>
                
                {children}
            </div>
        </>
    )
}

export default Drawer