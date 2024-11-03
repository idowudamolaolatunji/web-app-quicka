import React from 'react'
import Line from '../../components/Line';
import AppFigure from './connectedComponents/AppFigure';

import paystack from "../../assets/images/png_elements/paystack.png"
import whatsapp from "../../assets/images/png_elements/whatsapp-business-icon.webp"
import flutterwave from "../../assets/images/png_elements/flutterwave-store.png"
import fb_pixel from "../../assets/images/png_elements/facebook-pixel-icon.webp"
import Tab from '../../components/Tab';

const integrations = [
    { name: "Paystack", by: "paystack", tag: "payment", text: "Connect to recieve payment with paystack.", icon: paystack, connected: false, },
    { name: "Whatsapp", by: "meta", tag: "social", text: "Connect your whatsapp to recieve realtime notification for payment and sales.", icon: whatsapp, connected: false, },
    { name: "Flutterwave", by: "flutterwave", tag: "payment", text: "Connect to recieve payment with flutterwave.", icon: flutterwave, connected: false, },
    { name: "Facebook Pixel", by: "meta", tag: "ads", text: "Conntect facebook pixel for analytics and better ads experience.", icon: fb_pixel, connected: true, },
]

function index() {

    return (
        <>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Integrated App</h2>
            </div>

            <div className="page--tabs" style={{ marginTop: "-2rem" }}>
                <Tab title="All" active onClick="" value={10} />
                <Tab title="Socials" onClick="" value={2} />
                <Tab title="Others" onClick="" value={4} />
            </div>


            <Line border={1.4} where="Top" value="2rem" />


            <div className="page__section--main connected__grid">
                {integrations?.map(app => (
                    <AppFigure app={app} key={app?.name} />
                ))}
            </div>
        </>
    )
}

export default index