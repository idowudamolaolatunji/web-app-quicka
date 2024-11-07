import React, { useState } from 'react'
import Line from '../../components/Line';
import AppFigure from './connectedComponents/AppFigure';

import paystack from "../../assets/images/png_elements/paystack.png"
import whatsapp from "../../assets/images/png_elements/whatsapp-business-icon.webp"
import flutterwave from "../../assets/images/png_elements/flutterwave-store.png"
import fb_pixel from "../../assets/images/png_elements/facebook-pixel-icon.webp"
import Tab from '../../components/Tab';

const integrations = [
    { name: "Paystack", by: "paystack", tag: "payment", text: "Connect to recieve payment with paystack.", icon: paystack, connected: true, },
    { name: "Whatsapp", by: "meta", tag: "social", text: "Connect your whatsapp to recieve realtime notification for payment and sales.", icon: whatsapp, connected: false, },
    { name: "Flutterwave", by: "flutterwave", tag: "payment", text: "Connect to recieve payment with flutterwave.", icon: flutterwave, connected: false, },
    { name: "Facebook Pixel", by: "meta", tag: "ads", text: "Conntect facebook pixel for analytics and better ads experience.", icon: fb_pixel, connected: false, },
]

function index() {
    const [activeTab, setActiveTab] = useState("all");

    const all = integrations;
    const ads = integrations?.filter(app => app.tag === "ads");
    const socials = integrations?.filter(app => app.tag === "social");
    const payments = integrations?.filter(app => app.tag === "payment");

    const apps = activeTab == "all" ? all : integrations?.filter(app => app.tag === activeTab)

    console.log(activeTab)

    return (
        <>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Integrated App</h2>
            </div>

            <div className="page--tabs" style={{ marginTop: "-2rem" }}>
                <Tab title="All" active={activeTab == "all"} onClick={() => setActiveTab("all")} value={all?.length} />
                <Tab title="Socials" active={activeTab == "social"}  onClick={() => setActiveTab("social")} value={socials?.length} />
                <Tab title="Ads" active={activeTab == "ads"}  onClick={() => setActiveTab("ads")} value={ads?.length} />
                <Tab title="Payments" active={activeTab == "payment"}  onClick={() => setActiveTab("payment")} value={payments?.length} />
            </div>


            <Line border={1.4} where="Top" value="2rem" />


            <div className="page__section--main connected__grid">
                {apps.map(app => (
                    <AppFigure app={app} key={app?.name} />
                ))}
            </div>
        </>
    )
}

export default index