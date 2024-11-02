import React, { useState } from 'react';

import logo_img from '../../assets/images/logo/logo-black.png'
import { useDataContext } from '../../context/DataContext';
import { IoChevronDownSharp } from 'react-icons/io5';
import { MdOutlineStorefront } from 'react-icons/md';
import { RiMenu3Fill } from 'react-icons/ri';
import { LuBell, LuPanelLeftClose, LuPanelRightClose, LuRefreshCcw, LuUser } from 'react-icons/lu';

import { useWindowSize } from 'react-use';
import Dropdown from '../../components/Dropdown';
import { Link } from 'react-router-dom';
import DefaultButton from '../../components/button/DefaultButton';
import { useAuthContext } from '../../context/AuthContext';
import UserIntialsImage from '../../components/UserIntialsImage';
import CustomAlert from '../../components/CustomAlert';
import Spinner from '../../components/spinner/spinner_two'
import { Tooltip } from '@mui/material';
import TooltipUI from '../../components/TooltipUI';
import { useFetchedContext } from '../../context/FetchedContext';


function DashboardHead() {
    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { isMenuCollapsed, handleMenuCollapse, handleShowSidemenu } = useDataContext();
    const { error, handleGlobalRefetch } = useFetchedContext()

    const [isShownDropdown, setIsShownDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });


    const handleShowDropdown = function () {
        setIsShownDropdown(true);
    }

    const handleRefreshAll = function() {
        handleGlobalRefetch();
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
                        <span className='hamburger--icon' onClick={(width > 900) ? handleMenuCollapse : handleShowSidemenu}>
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
                        {(width > 600 && !error.order) && (
                            <DefaultButton>
                                <TooltipUI placement='top' title="Refresh all">
                                    <div className="nav--icon notification--icon" onClick={handleRefreshAll}>
                                        <LuRefreshCcw />
                                    </div>
                                </TooltipUI>
                            </DefaultButton>
                        )}

                        <a href={`https://${store?.storeUrl}`} target='_blank' className='store--btn'>
                            View Store <MdOutlineStorefront />
                        </a>

                        <DefaultButton>
                            <div className="nav--icon notification--icon">
                                <LuBell />
                            </div>
                        </DefaultButton>

                        <DefaultButton customStyle={{ fontFamily: 'inherit' }}>
                            <div className='nav--user' onClick={handleShowDropdown}>
                                <div className="user--box">
                                    <UserIntialsImage />
                                </div>
                                <div className='user--info'>
                                    <p className='user--name'>{`${user.firstname} ${user.lastname}`}</p>
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