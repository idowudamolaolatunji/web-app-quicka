import React, { useState } from 'react'
import Line from '../../components/Line';

import paystack from "../../assets/images/png_elements/paystack.png"
import whatsapp from "../../assets/images/png_elements/whatsapp-business-icon.webp"
import flutterwave from "../../assets/images/png_elements/flutterwave-store.png"
import fb_pixel from "../../assets/images/png_elements/facebook-pixel-icon.webp"
import { HiCheckBadge, HiOutlineCheckCircle } from 'react-icons/hi2';
import { VscDebugDisconnect } from 'react-icons/vsc';

const integrations = [
    { name: "Paystack", by: "paystack", tag: "payment", text: "Connect to recieve payment with paystack.", icon: paystack, connected: false, },
    { name: "Whatsapp", by: "meta", tag: "social", text: "Connect your whatsapp to recieve realtime notification for payment and sales.", icon: whatsapp, connected: false, },
    { name: "Flutterwave", by: "flutterwave", tag: "payment", text: "Connect to recieve payment with flutterwave.", icon: flutterwave, connected: false, },
    { name: "Facebook Pixel", by: "meta", tag: "ads", text: "Conntect facebook pixel for analytics and better ads experience.", icon: fb_pixel, connected: true, },
]

function index() {
    const [isHovered, setIsHovered] = useState(false);

    const handleHovered = () => setIsHovered(true);
    const handleNotHovered = () => setIsHovered(false);


    return (
        <>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Integrated App</h2>
            </div>

            <div className="page--tabs" style={{ marginTop: "-2rem" }}>
                <button className='page--tab active'>All (<span className='value'>10</span>)</button>
                <button className='page--tab'>Socials (<span className='value'>2</span>)</button>
                <button className='page--tab'>Others (<span className='value'>4</span>)</button>
            </div>


            <Line border={1.4} where="Top" value="2rem" />


            <div className="page__section--main connected__grid">
                {integrations?.map(app => (
                    <figure className={`connected--figure ${app?.connected ? "connected" : ""}`} key={app?.name}>
                        <div className='connected--top'>
                            <img className='img' src={app?.icon} alt={app?.name} />
                            <button onMouseEnter={handleHovered} onMouseLeave={handleNotHovered} className={(app?.connected && isHovered) ? "disconnect" : ""}>
                                {app?.connected ?
                                    (isHovered ? <>Disconnect <VscDebugDisconnect /></> : <>Connected <HiOutlineCheckCircle /></>) 
                                    : ( <>connect</> )
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
                ))}
            </div>
        </>
    )
}

export default index