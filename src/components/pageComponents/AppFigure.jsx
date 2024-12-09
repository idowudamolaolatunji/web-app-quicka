import React, { useState } from 'react'

import { HiCheckBadge, HiOutlineCheckCircle } from 'react-icons/hi2';
import { VscDebugDisconnect } from 'react-icons/vsc';

function AppFigure({ app }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleHovered = function() {
        setIsHovered(true);
    }
    const handleNotHovered = function() {
        setIsHovered(false);
    }

    return (
        <figure className={`connected--figure ${app?.connected ? "connected" : ""}`}>
            <div className='connected--top'>
                <img className='img' src={app?.icon} alt={app?.name} />
                <button onMouseEnter={handleHovered} onMouseLeave={handleNotHovered} className={(app?.connected && isHovered) ? "disconnect" : ""}>
                    {app?.connected ?
                        (isHovered ? <>Disconnect <VscDebugDisconnect /></> : <>Connected <HiOutlineCheckCircle /></>)
                        : (<>connect</>)
                    }
                </button>
            </div>

            <div className="connected--details">
                <span className='connected--heading'>
                    <p className='heading'>{app?.name}</p>
                    <span><HiCheckBadge /> by {app?.by}</span>
                </span>

                <p className='connected--text'>{app?.text}</p>
            </div>
        </figure>
    )
}

export default AppFigure