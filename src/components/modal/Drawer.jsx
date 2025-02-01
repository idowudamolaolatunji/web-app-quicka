import React from 'react'
import Overlay from '../layout/Overlay'
import BackButton from '../button/BackButton'
import Line from '../elements/Line'

function Drawer({ title, children, setClose }) {

    function handleClose() {
        setClose(false)
    }

    return (
        <>
            <Overlay handleClose={handleClose} />
            <div className="drawer--modal">
                <div className="drawer--head">
                    <span className='flex' style={{ flexDirection: "row", alignItems: "center" }}>
                        <BackButton close={handleClose} />
                        <h3 className="page__section--title">{title}</h3>
                    </span>

                    <Line border={1.4} where="Top" value="2rem" />
                </div>
                
                {children}
            </div>
        </>
    )
}

export default Drawer