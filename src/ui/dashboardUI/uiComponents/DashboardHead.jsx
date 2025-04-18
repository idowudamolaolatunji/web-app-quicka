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


function DashboardHead() {
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { globalConnectionError, handleGlobalRefetch } = useFetchedContext();
    const { isMenuCollapsed, handleMenuCollapse, handleShowSidemenu } = useDataContext();
    // const { isMenuCollapsed, handleMenuCollapse, handleShowSidemenu, displayMode, handleToggleDisplayMode } = useDataContext();

    const [isShownDropdown, setIsShownDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });


    const handleShowDropdown = function () {
        setIsShownDropdown(true);
    }


    return (
        <>
            {loading && <Spinner />}
            
            {(response.status || response.message) && <CustomAlert type={response.status} message={response.message} />}

            <header className='dashboard--header'>
                <div className='logo--container' style={isMenuCollapsed ? { borderBottomColor: '#d4d7db' } : {}}>
                    <Link to='/'>
                        <img src={logo_img} alt='Quick logo' />
                    </Link>

                    <DefaultButton>
                        <span className="hamburger--icon" onClick={(width > 900) ? handleMenuCollapse : handleShowSidemenu}>
                            {(width > 900) ? (
                                isMenuCollapsed ? <LuPanelRightClose style={{ fontSize: '2rem' }} /> : <LuPanelLeftClose style={{ fontSize: '2rem' }} />
                            ) : (
                                <RiMenu3Fill />
                            )}
                        </span>
                    </DefaultButton>
                </div>

                <div className='nav--container'>
                    <div className=""></div>

                    <div className="nav--others">
                        {/* {width > 600 && (
                            <DefaultButton>
                                <TooltipUI placement='top' title={`Switch to ${displayMode == "dark" ? "light" : "dark"} mode`}>
                                    <div className="nav--icon" onClick={handleToggleDisplayMode}>
                                        {displayMode == "light" ? (
                                            <IoSunny style={{ color: "orange" }} />
                                        ) : (
                                            <IoMoon style={{ color: "#aaa" }} />
                                        )}
                                    </div>
                                </TooltipUI>
                            </DefaultButton>
                        )} */}

                        {(width > 600 && !globalConnectionError && store?.storeOnboardCompleted ) && (
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
                            <div className='nav--user' onClick={handleShowDropdown}>
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
                            <Dropdown isShown={isShownDropdown} setIsShown={setIsShownDropdown} setLoading={setLoading} setResponse={setResponse} />
                        )}
                    </div>

                </div>
            </header>

        </>
    )
}

export default DashboardHead