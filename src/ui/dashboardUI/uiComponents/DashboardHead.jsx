import React, { useState } from 'react';

import logo_img from '../../../assets/images/logo/logo-black.png'
import { useDataContext } from '../../../context/DataContext';
import { IoChevronDownSharp, IoMoon, IoSunny } from 'react-icons/io5';
import { RiMenu3Fill } from 'react-icons/ri';
import { LuBell, LuPanelLeftClose, LuPanelRightClose, LuRefreshCcw } from 'react-icons/lu';

import { useWindowSize } from 'react-use';
import Dropdown from '../../../components/layout/Dropdown';
import { Link } from 'react-router-dom';
import DefaultButton from '../../../components/button/DefaultButton';
import { useAuthContext } from '../../../context/AuthContext';
import IntialsImage from '../../../components/layout/IntialsImage';
import CustomAlert from '../../../components/layout/CustomAlert';
import Spinner from '../../../components/spinner/mainSpinner'
import TooltipUI from '../../../components/layout/TooltipUI';
import { useFetchedContext } from '../../../context/FetchedContext';
import BackButton from '../../../components/button/BackButton';
import { useCheckInternetConnection } from '../../../hooks/useCheckInternetConnection';


function DashboardHead({ nonDashboard=false }) {
    // nonDashboard=true is a when the header is used outside of the dashboard
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { handleGlobalRefetch } = useFetchedContext();
    const checkConnection = useCheckInternetConnection();
    const { isMenuCollapsed, handleMenuCollapse, handleShowSidemenu } = useDataContext();

    const [isShownDropdown, setIsShownDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });

    const handleToggleDropdown = function () {
        setIsShownDropdown(!isShownDropdown);
    }

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
                            <span className="hamburger--icon" onClick={(width > 900) ? handleMenuCollapse : handleShowSidemenu}>
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
                    <div className=""></div>

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
                                <div className="nav--icon">
                                    <LuBell />
                                </div>
                            </DefaultButton>
                        ) : (
                            <div className="nav--icon">
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
                    </div>

                </div>
            </header>

        </React.Fragment>
    )
}

export default DashboardHead