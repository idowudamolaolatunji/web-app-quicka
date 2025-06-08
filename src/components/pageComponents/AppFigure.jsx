import React, { useState } from 'react'

import { HiCheckBadge, HiOutlineCheckCircle } from 'react-icons/hi2';
import { PiPlugsConnected } from 'react-icons/pi';
import { VscDebugDisconnect } from 'react-icons/vsc';
import CustomAlert from '../layout/CustomAlert';
import Spinner from '../spinner/MainSpinner';
import { createPortal } from 'react-dom';
import IntegrationModal from '../modal/IntegrationModal';

function AppFigure({ app }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState({ connect: false, disconnect: false })
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });
    const [selectedApp, setSelectedApp] = useState(null);

    const handleHovered = function () {
        setIsHovered(true);
    }
    const handleNotHovered = function () {
        setIsHovered(false);
    }

    const handleResetResponse = function () {
        setResponse({ status: "", message: "" });
    }

    const handleShowModal = function () {
        setSelectedApp(app);
        setShowModal(app?.connected ? { disconnect: true, connect: false } : { connect: true, disconnect: false })
    }

    const handleCloseModal = function () {
        setSelectedApp(null);
        setShowModal({ connect: false, disconnect: false })
    }

    return (
        <>

            {loading && createPortal(<Spinner />, document.body)}

            {(response.message || response.status) && (
                createPortal(
                    <CustomAlert type={response.status} message={response.message} />,
                    document.body
                )
            )}

            {/* THIS HERE IS THE MODEL THAT POPS UP FOR ANY INTEGRATION ACTION, CONNECT OR DISCONNECT */}
            {(showModal.connect || showModal.disconnect) && (
                createPortal(
                    <IntegrationModal setClose={handleCloseModal} customClass={showModal?.connect ? "connect" : "disconnect"}>
                        <h3 className="modal--title">{showModal?.connect ? "Connect" : "Disconnect"} {selectedApp?.name}</h3>

                    </IntegrationModal>,
                    document.body
                )
            )}

            <figure className={`connected--figure ${app?.connected ? "connected" : ""}`}>
                <div className='connected--top'>
                    <img className='img' src={app?.icon} alt={app?.name} />
                    <button onMouseEnter={handleHovered} onMouseLeave={handleNotHovered} className={(app?.connected && isHovered) ? "disconnect" : ""} onClick={handleShowModal}>
                        {app?.connected ?
                            (isHovered ? <>Disconnect <VscDebugDisconnect /></> : <>Connected <HiOutlineCheckCircle /></>)
                            : (<>connect <PiPlugsConnected /></>)
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
        </>
    )
}

export default AppFigure