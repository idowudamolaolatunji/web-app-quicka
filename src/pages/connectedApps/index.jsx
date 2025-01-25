import React, { useEffect, useState } from 'react'
import Line from '../../components/elements/Line';
import AppFigure from '../../components/pageComponents/AppFigure';

import paystack from "../../assets/images/png_elements/paystack.png"
import whatsapp from "../../assets/images/png_elements/whatsapp-business-icon.webp"
import flutterwave from "../../assets/images/png_elements/flutterwave-store.png"
import fb_pixel from "../../assets/images/png_elements/facebook-pixel-icon.webp"
import google_analytics from "../../assets/images/png_elements/google-analytics.png"
import Tab from '../../components/elements/Tab';
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/layout/ConnectionError';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import ErrorComponent from '../../components/layout/ErrorComponent';
import { useAuthContext } from '../../context/AuthContext';
import AppSkeleton from '../../components/skeleton/AppSkeleton';

function index() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParams = queryParams.get("tab")
    ///////////////////////////////////////////////////////
    const { store } = useAuthContext();
    const { globalConnectionError } = useFetchedContext();
    const [activeTab, setActiveTab] = useState("");
    const [loading, setLoading] = useState(true)


    const [integrations, setIntegrations] = useState([
        { name: "Paystack", slug: "paystack", by: "paystack", tag: "payment", text: "Connect to recieve payment with paystack.", icon: paystack, connected: true, },
        { name: "Whatsapp", slug: "whatsapp", by: "meta", tag: "social", text: "Connect your whatsapp to recieve realtime notification for payment and order.", icon: whatsapp, connected: false, },
        { name: "Facebook Pixel", slug: "facebook_pixel", by: "meta", tag: "ads", text: "Conntect facebook pixel for analytics and better ads experience.", icon: fb_pixel, connected: false, },
        { name: "Flutterwave", slug: "flutterwave", by: "flutterwave", tag: "payment", text: "Connect to recieve payment with flutterwave.", icon: flutterwave, connected: false, },
        { name: "Google Analytics", slug: "google_analytics", by: "google", tag: "ads", text: "Conntect google analytics for better analytics and measure ads properly.", icon: google_analytics, connected: false, },
    ]);

    ///////////////////////////////////////////////////////
    const all = integrations;
    const ads = integrations?.filter(app => app.tag === "ads");
    const socials = integrations?.filter(app => app.tag === "social");
    const payments = integrations?.filter(app => app.tag === "payment");

    const apps = activeTab == "all" ? all : integrations?.filter(app => app.tag === activeTab);

    const updateState = function(slug, booleanValue) {
        setIntegrations(prevState => prevState.map(app => (
            app.slug === slug ? { ...app, booleanValue } : app
        )));
    };

    useEffect(function () {
        document.title = 'Quicka | Application integrated';
    }, []);

    useEffect(function () {
        window.scrollTo(0, 0);

        updateState("paystack", store?.integrations?.paystack);
        updateState("whatsapp", store?.integrations?.whatsapp);
        updateState("facebook_pixel", store?.integrations?.facebook_pixel);
        updateState("flutterwave", store?.integrations?.flutterwave);
        updateState("google_analytics", store?.integrations?.google_analytics);
    }, [store]);

    useEffect(function () {
        setLoading(true);
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=all")
        }

        setTimeout(() => setLoading(false), 1000)
    }, [tabParams])

    return (
        <>
            {globalConnectionError && <ConnectionError />}

            <div className='page__section--heading'>
                <h2 className="page__section--title">Integrated App</h2>
            </div>

            <div className="page--tabs" style={{ margin: "-2rem 0 0" }}>
                <Tab title="All apps" active={activeTab == "all"} onClick={() => navigate("?tab=all")} value={all?.length} />
                <Tab title="Socials" active={activeTab == "social"} onClick={() => navigate("?tab=social")} value={socials?.length} />
                <Tab title="Ads" active={activeTab == "ads"} onClick={() => navigate("?tab=ads")} value={ads?.length} />
                <Tab title="Payments" active={activeTab == "payment"} onClick={() => navigate("?tab=payment")} value={payments?.length} />
            </div>


            <Line border={1.4} where="Top" value="2rem" />

            {globalConnectionError && <ErrorComponent customStyle={{ padding: "10rem 2rem 6rem" }} />}

            {!globalConnectionError && (
                <div className="page__section--main connected__grid">
                    {apps.map(app => (
                        loading ? (
                            <AppSkeleton />
                        ) : (
                            <AppFigure app={app} key={app?.name} />
                        )
                    ))}
                </div>
            )}
        </>
    )
}

export default index