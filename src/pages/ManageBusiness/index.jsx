import React, { useState } from 'react'
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


export default function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const handleSwitchStore = function(currStore) {
        setLoading(true);
        if(currStore?._id == store?._id) {
            setTimeout(() => setLoading(false), 1000)
            navigate("/dashboard");
            return;
        }


    }


  return (
    <React.Fragment>
        {loading && <Spinner />}
        
        <DashboardHead nonDashboard={true} />
        <section className="manage--business-section">
            <span className="flex-align-center">
                <BackButton /> {width > 450 && <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>Back</p>}
            </span>

            <div className="manage--business-content">
                <div className="content--top">
                    <h4>Hi, CEO {user?.firstname} 👋🏿</h4>
                    <p>Let help you manage your businesses. Please select the business you want to continue with, Or click the button below to add a new or existing business</p>
                </div>

                <div className="content--stores">
                    {user?.stores?.map(mystore => (
                        <div className="menu--store" onClick={() => handleSwitchStore(mystore)}>
                            <IntialsImage type="store" store={mystore} />

                            <span className="menu--store-detail">
                                <p className='text'>
                                    {truncateString("jdjwhdhsj jhehahshsh", width < 450 ? 16 : 30)}
                                    <span className='sub-text'>{mystore?.location?.country?.name} ({mystore?.location?.country?.iso2})</span>
                                </p>
                                <a href={`https://${mystore?.storeUrl}`} target='_blank' className='link--btn'>
                                    {truncateString(mystore?.storeUrl, width < 450 ? 20 : 35)}
                                </a>
                            </span>

                            <span style={{ marginLeft: "auto" }}>
                                <BiChevronRight />
                            </span>
                        </div>
                    ))}
                </div>

                <button className="content--btn" onClick="">
                    <RiApps2AddLine /> Add new or existing business
                </button>
            </div>
        </section>
    </React.Fragment>
  )
}
