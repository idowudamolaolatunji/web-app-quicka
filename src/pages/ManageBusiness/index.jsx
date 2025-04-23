import React, { useEffect, useState } from 'react'
import DashboardHead from '../../ui/dashboardUI/uiComponents/DashboardHead'
import BackButton from '../../components/button/BackButton'
import { useAuthContext } from '../../context/AuthContext'
import IntialsImage from '../../components/layout/IntialsImage';
import { truncateString } from '../../utils/helper';
import { useWindowSize } from 'react-use';
import { BiChevronRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/spinner/mainSpinner';
import SwitchLoader from '../../components/spinner/switching';
import { RiApps2AddLine, RiProgress1Line, RiVerifiedBadgeLine } from 'react-icons/ri';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, store, headers, handleStore, handleUser, setShouldLoad } = useAuthContext();
    ///////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [switchingLoader, setSwitchingLoader] = useState(false);
    const [subscribeModal, setSubscribeModal] = useState(false);

    const handleSwitchStore = async function(slug) {
        if(slug == store?.slug) {
            setTimeout(function() {
                navigate("/dashboard");
            }, 250);
        }

        if(slug != store?.slug) {
            setSwitchingLoader(true);
            const res = await fetch(`${BASE_API_URL}/stores/mine/outlet?slug=${slug}`, {
                method: "GET", headers
            });
            const data = await res.json();
            setSwitchingLoader(false);
            if(!data?.status || !res.ok) return
            setShouldLoad(true);
            handleStore(data?.data?.store);
            handleUser(data?.data?.auth);
            navigate("/dashboard");
        }

        window.scrollTo(0, 0);
    }

    
    const handleManageNew = function() {
        setLoading(true);
        // check for subscription 

        setTimeout(function() {
            setLoading(false)
            localStorage.setItem(`${import.meta.env.VITE_USERID_KEY}`, user?._id);
            navigate("/manage-business/new");
        }, 1000)
    }

    useEffect(function() {
        setTimeout(() => setLoading(false), 1000);
        if(!user) navigate(-1);
    }, []);

  return (
    <React.Fragment>
        {loading && <Spinner />}
        {switchingLoader && <SwitchLoader />}
        
        <DashboardHead nonDashboard={true} />
        <section className="manage--business-section">
            <div className="manage--business-content">
                <div className="content--top">
                    {(width > 900) && <BackButton />}
                    <h4>Welcome back, {user?.firstname} 👋🏿</h4>
                    <p className='auth--right-text' style={{ margin: 0, textAlign: "center" }}>
                        Let help you manage your businesses. Please select the business you want to continue with, Or click the button below to add a new or existing business.
                    </p>
                </div>

                <div className="content--stores">
                    {user?.stores?.map(mystore => (
                        <div className="menu--store" onClick={() => handleSwitchStore(mystore?.slug)} key={mystore?._id}>
                            <IntialsImage type="store" store={mystore} />

                            <span className="menu--store-detail">
                                <p className='text'>
                                    {truncateString(mystore?.name, width < 450 ? 14 : 30)}
                                    <span className='sub-text'>
                                        {mystore?.location?.country?.name} ({mystore?.location?.country?.iso2})
                                    </span>
                                    {(mystore?.storeOnboardCompleted && width > 400) && (
                                        <p className='status active'>Active <RiVerifiedBadgeLine /></p>
                                    )}
                                </p>
                                {mystore?.storeOnboardCompleted ? (
                                    <a href={`https://${mystore?.storeUrl}`} target='_blank' className='link--btn'>
                                        {truncateString("https://"+mystore?.storeUrl, width < 450 ? 28 : 35)}
                                    </a>
                                ) : (
                                    <p className='status progress'>Onboarding In Progress <RiProgress1Line /></p>
                                )}
                            </span>

                            <span className='action' style={{ margin: "0 -.6rem 0 auto" }}>
                                <BiChevronRight />
                            </span>
                        </div>
                    ))}
                </div>

                <button className="content--btn" onClick={handleManageNew}>
                    <RiApps2AddLine /> Add new or existing business
                </button>
            </div>
        </section>
    </React.Fragment>
  )
}
