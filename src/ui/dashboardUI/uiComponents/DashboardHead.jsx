import React, { useEffect, useState } from 'react';

import logo_img from '../../../assets/images/logo/logo-black.png'
import { useDataContext } from '../../../context/DataContext';
import { IoChevronDownSharp, IoMoon, IoSunny } from 'react-icons/io5';
import { RiMenu3Fill } from 'react-icons/ri';
import { LuBell, LuPanelLeftClose, LuPanelRightClose, LuRefreshCcw } from 'react-icons/lu';

import { useLocalStorage, useWindowSize } from 'react-use';
import Dropdown from '../../../components/layout/Dropdown';
import { Link } from 'react-router-dom';
import DefaultButton from '../../../components/button/DefaultButton';
import { useAuthContext } from '../../../context/AuthContext';
import IntialsImage from '../../../components/layout/IntialsImage';
import CustomAlert from '../../../components/layout/CustomAlert';
import Spinner from '../../../components/spinner/MainSpinner'
import TooltipUI from '../../../components/layout/TooltipUI';
import { useFetchedContext } from '../../../context/FetchedContext';
import BackButton from '../../../components/button/BackButton';
import { useCheckInternetConnection } from '../../../hooks/useCheckInternetConnection';
import Drawer from '../../../components/modal/Drawer';
import Notification from '../../../components/pageComponents/Notification';
import { MdOutlineRefresh } from 'react-icons/md';


function DashboardHead({ nonDashboard=false }) {
    // nonDashboard=true is a when the header is used outside of the dashboard
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { handleGlobalRefetch, notifications, handleFetchMyStoreNotifications } = useFetchedContext();
    const unreadNotifications = notifications?.filter(notification => notification?.status == "unread");

    const checkConnection = useCheckInternetConnection();
    const { isMenuCollapsed, handleMenuCollapse, handleToggleSidemenu } = useDataContext();

    const [isShownDropdown, setIsShownDropdown] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });
    const [showIndicator, setShowIndicator] = useState(false);
    const [indicatorAmount] = useLocalStorage("indicator", 0);


    const handleToggleDropdown = function () {
        setIsShownDropdown(!isShownDropdown);
    }
    
    const handleToggleNotification = function () {
        setShowNotification(!showNotification);
    }

    useEffect(function() {
        setShowIndicator(unreadNotifications?.length > indicatorAmount);
    }, [notifications, indicatorAmount]);

    return (
        <React.Fragment>
            {loading && <Spinner />}
            
            {(response.status || response.message) && <CustomAlert type={response.status} message={response.message} />}

            <header className='dashboard--header'>
                <div className='logo--container' style={(isMenuCollapsed || nonDashboard) ? { borderBottomColor: '#d4d7db' } : {}}>
                    <Link to='/'>
                        <img src={logo_img} alt='Quick logo' />
                    </Link>

                    {!nonDashboard ? (
                        <DefaultButton>
                            <span className="hamburger--icon" onClick={(width > 900) ? handleMenuCollapse : handleToggleSidemenu}>
                                {(width > 900) ? (
                                    isMenuCollapsed ? <LuPanelRightClose style={{ fontSize: '2rem' }} /> : <LuPanelLeftClose style={{ fontSize: '2rem' }} />
                                ) : (
                                    <RiMenu3Fill />
                                )}
                            </span>
                        </DefaultButton>
                    ) : (
                        (width < 901) && (
                            <BackButton />
                        )
                    )}
                </div>

                <div className='nav--container'>
                    <div />

                    <div className="nav--others">
                        {(width > 600 && store?.storeOnboardCompleted && checkConnection == "online") && (
                            <DefaultButton>
                                <TooltipUI placement='top' title="Reload app">
                                    <div className="nav--icon" onClick={handleGlobalRefetch}>
                                        <LuRefreshCcw />
                                    </div>
                                </TooltipUI>
                            </DefaultButton>
                        )}


                        {width > 600 ? (
                            <DefaultButton>
                                <TooltipUI placement='top' title="Notifications">
                                    <div className={`nav--icon ${showIndicator ? "notification" : ""}`} onClick={handleToggleNotification}>
                                        <LuBell />
                                    </div>
                                </TooltipUI>
                            </DefaultButton>
                        ) : (
                            <div className={`nav--icon ${showIndicator ? "notification" : ""}`} onClick={handleToggleNotification}>
                                <LuBell />
                            </div>
                        )}

                        <DefaultButton customStyle={{ fontFamily: 'inherit' }}>
                            <div className='nav--user' onClick={handleToggleDropdown}>
                                <div className="user--box">
                                    <IntialsImage />
                                </div>
                                <div className='user--info'>
                                    <p className='user--name'>{`${user?.firstname} ${user?.lastname}`}</p>
                                    <IoChevronDownSharp />
                                </div>
                            </div>
                        </DefaultButton>

                        {/* DROPDOWN MENU */}
                        {isShownDropdown && (
                            <Dropdown handleToggle={handleToggleDropdown} setLoading={setLoading} setResponse={setResponse} />
                        )}

                        {/* NOTIFICATION SIDEBAR */}
                        {showNotification && (
                            <Drawer
                                title={
                                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                                        Notifications
                                        <span style={{ opacity: "0.6", fontSize: "1.8rem", marginRight: "auto" }}>
                                            (<span className='value'>{!notifications ? "0" : unreadNotifications?.length < 10 ? (unreadNotifications?.length || 0) : "10+"}</span>)
                                        </span>

                                        <TooltipUI placement='top' title="Reload">
                                            <button className='table--btn' onClick={handleFetchMyStoreNotifications}><MdOutlineRefresh style={{ margin: "0" }} /></button>
                                        </TooltipUI>
                                    </div>
                                }
                                setClose={handleToggleNotification} iconType="close"
                            >
                                <Notification setIndicator={setShowIndicator} close={handleToggleNotification} />
                            </Drawer>
                        )}
                    </div>
                </div>
            </header>

        </React.Fragment>
    )
}

export default DashboardHead