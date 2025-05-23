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
    const { errorType } = useFetchedContext();
    const [activeTab, setActiveTab] = useState("");
    const [loading, setLoading] = useState(true)


    const [integrations, setIntegrations] = useState([
        { name: "Paystack", slug: "paystack", by: "paystack", tag: "payment", text: "Connect to recieve payment with paystack.", icon: paystack, connected: true, },
        { name: "Flutterwave", slug: "flutterwave", by: "flutterwave", tag: "payment", text: "Connect to recieve payment with flutterwave.", icon: flutterwave, connected: true, },
        { name: "Whatsapp", slug: "whatsapp", by: "meta", tag: "notification", text: "Connect your whatsapp to recieve realtime notification for payment and order.", icon: whatsapp, connected: false, },
        { name: "Facebook Pixel", slug: "facebook_pixel", by: "meta", tag: "adslytics", text: "Conntect facebook pixel for better ads mesurement and experience.", icon: fb_pixel, connected: false, },
        { name: "Google Analytics", slug: "google_analytics", by: "google", tag: "adslytics", text: "Conntect google analytics for better analytics and track visitors properly.", icon: google_analytics, connected: false, },
    ]);

    ///////////////////////////////////////////////////////
    const all = integrations;
    const adslytics = integrations?.filter(app => app.tag === "adslytics");
    const notifications = integrations?.filter(app => app.tag === "notification");
    const payments = integrations?.filter(app => app.tag === "payment");
    ///////////////////////////////////////////////////////
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

        // THERE CAN ONLY EVER BE ONE PAYMENT INTEGRATION
        if(store?.paymentSettings?.name == "paystack") {
            setIntegrations(prev => [...prev?.filter(step => step?.slug !== "flutterwave")])
        }
        if(store?.paymentSettings?.name == "flutterwave") {
            setIntegrations(prev => [...prev?.filter(step => step?.slug !== "paystack")])
        }
    }, [store]);


    useEffect(function () {
        setLoading(true);
        if (tabParams) {
            setActiveTab(tabParams)
        } else {
            navigate("?tab=all")
        }

        setTimeout(() => setLoading(false), 500)
    }, [tabParams])

    return (
        <React.Fragment>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Integrated App</h2>
            </div>

            <div className="page--tabs" style={{ margin: "-2rem 0 0" }}>
                <Tab title="All apps" active={activeTab == "all"} onClick={() => navigate("?tab=all")} value={all?.length} />
                <Tab title="Ads & Analytics" active={activeTab == "adslytics"} onClick={() => navigate("?tab=adslytics")} value={adslytics?.length} />
                <Tab title="Notification" active={activeTab == "notification"} onClick={() => navigate("?tab=notification")} value={notifications?.length} />
                <Tab title="Payments" active={activeTab == "payment"} onClick={() => navigate("?tab=payment")} value={payments?.length} />
            </div>


            <Line border={1.4} where="Top" value="2rem" />

            {errorType && <ErrorComponent customStyle={{ padding: "10rem 2rem 6rem" }} />}

            {!errorType && (
                <div className="page__section--main connected__grid">
                    {apps.map(app => (
                        loading ? (
                            <AppSkeleton key={app.name} />
                        ) : (
                            <AppFigure app={app} key={app?.name} />
                        )
                    ))}
                </div>
            )}
        </React.Fragment>
    )
}

export default index