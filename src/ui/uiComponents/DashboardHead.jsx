import React, { useState } from 'react';

import logo_img from '../../assets/images/logo/logo-black.png'
import { useDataContext } from '../../context/DataContext';
import { IoChevronDownSharp } from 'react-icons/io5';
import { MdOutlineStorefront } from 'react-icons/md';
import { RiMenu3Fill } from 'react-icons/ri';
import { LuBell, LuPanelLeftClose, LuPanelRightClose, LuUser } from 'react-icons/lu';

import { useWindowSize } from 'react-use';
import Dropdown from '../../components/Dropdown';
import { Link } from 'react-router-dom';
import DefaultButton from '../../components/button/DefaultButton';
import { useAuthContext } from '../../context/AuthContext';
import UserIntialsImage from '../../components/UserIntialsImage';


function DashboardHead() {
    const [isShownDropdown, setIsShownDropdown] = useState(false);

    const { width } = useWindowSize();
    const { user, store } = useAuthContext();
    const { isMenuCollapsed, handleMenuCollapse, handleShowSidemenu } = useDataContext();

    function handleShowDropdown() {
        setIsShownDropdown(true)
    }

    return (
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
                        <Dropdown isShown={isShownDropdown} setIsShown={setIsShownDropdown} />
                    )}
                </div>

            </div>
        </header>
    )
}

export default DashboardHead