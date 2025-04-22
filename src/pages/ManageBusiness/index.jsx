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
import { RiApps2AddLine } from 'react-icons/ri';
import IntegrationModal from '../../components/modal/IntegrationModal';


export default function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState(false);

    const handleSwitchStore = function(currStore) {
        setLoading(true);
        if(currStore?._id == store?._id) {
            setTimeout(function() {
                setLoading(false)
                navigate("/dashboard");
            }, 1000)
            return;
        }
    }
    
    const handleManageNew = function() {
        setLoading(true);
        // if()

        setTimeout(function() {
            setLoading(false)
            navigate("/manage-business/new");
        }, 1000)
    }

    useEffect(function() {
        setTimeout(() => setLoading(false), 1000)
    }, []);

  return (
    <React.Fragment>
        {loading && <Spinner />}
        {/* {confirmModal && (
            <IntegrationModal setClose={() => setConfirmModal(false)}>
                <h4>Create another store</h4>
            </IntegrationModal>
        )} */}
        
        <DashboardHead nonDashboard={true} />
        <section className="manage--business-section">
            <div className="manage--business-content">
                <div className="content--top">
                    <span className="flex-align-center" style={{ marginBottom: "1.4rem", justifyContent: "center", gap: "1rem" }}>
                        <BackButton /><h4>Welcome back, {user?.firstname} {width > 450 && "👋🏿"}</h4>
                    </span>
                    <p className='auth--right-text' style={{ margin: 0 }}>Let help you manage your businesses. Please select the business you want to continue with, Or click the button below to add a new or existing business.</p>
                </div>

                <div className="content--stores">
                    {user?.stores?.map(mystore => (
                        <div className="menu--store" onClick={() => handleSwitchStore(mystore)}>
                            <IntialsImage type="store" store={mystore} />

                            <span className="menu--store-detail">
                                <p className='text'>
                                    {truncateString(mystore?.name, width < 450 ? 14 : 30)}
                                    <span className='sub-text'>{mystore?.location?.country?.name} ({mystore?.location?.country?.iso2})</span>
                                </p>
                                <a href={`https://${mystore?.storeUrl}`} target='_blank' className='link--btn'>
                                    {truncateString("https://"+mystore?.storeUrl, width < 450 ? 28 : 35)}
                                </a>
                            </span>

                            <span style={{ marginLeft: "auto" }}>
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
