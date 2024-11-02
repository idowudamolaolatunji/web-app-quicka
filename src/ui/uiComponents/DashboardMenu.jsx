import React, { useEffect, useState } from 'react';
import MenuLink from './MenuLink';
import Line from '../../components/Line';

import { AiOutlineBank, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { LuGlobe, LuLayoutPanelLeft, LuRotate3D, LuTags } from 'react-icons/lu';
import { FiUsers } from 'react-icons/fi';
import { MdChatBubble, MdOutlineChatBubbleOutline, MdOutlineDashboard, MdOutlineDeliveryDining, MdOutlineHelp, MdOutlineHelpOutline, MdOutlineSettings, MdOutlineShoppingBag, MdOutlineSsidChart, MdOutlineStorefront, MdOutlineWebhook } from 'react-icons/md';
import { BiCustomize, BiLineChart } from 'react-icons/bi';
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import { useDataContext } from '../../context/DataContext';
import { RiAppsLine, RiBankLine, RiCloseFill, RiCoupon3Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import Overlay from '../../components/Overlay';
import MenuButton from './MenuButton';
import { openWidget } from '../../utils/helper';
import { TbTransactionDollar, TbTruckDelivery } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';
import TooltipUI from '../../components/TooltipUI';


function DashboardMenu() {
    const [showRemains, setShowRemains] = useState(false);
    const { isMenuCollapsed, showSidemenu, handleShowSidemenu, animateOut } = useDataContext();
    const { width } = useWindowSize()
    const { pathname } = useLocation();

    function handleShowRemains() {
        setShowRemains(!showRemains)
    }


    useEffect(function() {
        if(
            pathname.includes("delivery") 
            || pathname.includes("store-info") 
            || pathname.includes("subscription")
            || pathname.includes("custom-domain")
            || pathname.includes("store-customisation")
        ) {
            setShowRemains(true);
        }
    }, [pathname]);
    

    return (
        <>
            {width > 900 && (
                <div className='dashboard--menu'>
                    <div className='menu--block'>
                        {!isMenuCollapsed && (
                            <span className='block--heading'>
                                <p className='heading--text'>Main Access</p>
                            </span>
                        )}
                        <ul className='menu--list'>
                            <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                            <MenuLink icon={<MdOutlineShoppingBag />} title='Your Orders' link='/orders' />
                            <MenuLink icon={<LuTags />} title='Your Products' link='/products' />
                            <MenuLink icon={<BiLineChart />} title='Store Analytics' link='/analytics' />
                            <MenuLink icon={<RiCoupon3Line />} title='Run sales and coupon' link='/run-sales' />
                            <MenuLink icon={<FiUsers />} title='Your Customers' link='/customers' />
                            <MenuLink icon={<TbTransactionDollar />} title='All Transactions' link='/transactions' />
                            <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                        </ul>
                    </div>

                    <div className={`menu--block settings ${showRemains ? 'menu-animate' : ''}`}>
                        <Line where={'Bottom'} value={'0.34rem'} />

                            {!isMenuCollapsed ? (
                                <span className='block--heading' onClick={handleShowRemains}>
                                    <p className='heading--text' style={{ cursor: 'pointer' }}>Store Settings</p>
                                    <div className='heading--icon'>
                                        {showRemains ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                    </div>
                                </span>
                            ) : (
                                <TooltipUI placement='right' title={showRemains ? "Show Less" : "Show More"}>
                                    <div className='heading--icon' onClick={handleShowRemains}>
                                        {showRemains ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                    </div>
                                </TooltipUI>
                            )}

                        {showRemains && (
                            <ul className={`menu--list ${showRemains ? 'menu-animate' : 'menu-unanimate'}`}>
                                <MenuLink icon={<MdOutlineStorefront />} title='Store Information' link='/store-info' />
                                <MenuLink icon={<TbTruckDelivery />} title='Delivery and Rates' link='/delivery-rates' />
                                <MenuLink icon={<LuGlobe />} title='Custom Domain' link='/custom-domain' />
                                <MenuLink icon={<HiOutlineSquare3Stack3D />} title='Subscription' link='/subscription' />
                                <MenuLink icon={<BiCustomize />} title='Store Customisation' link='/store-customisation' />
                            </ul>
                        )}

                        <Line where={'Top'} value={'0.34rem'} />

                    </div>


                    <ul className={`menu--list ${!showRemains ? 'last--menu' : ''}`}>
                        <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' />
                        <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        <MenuButton icon={<MdOutlineHelpOutline />} title='Help Center'action={openWidget} />
                    </ul>
                </div>
            )}

            {(width < 900 && showSidemenu) && (
                <>
                    {width >= 600 && <Overlay handleClose={handleShowSidemenu} />}
                    <div className={`dashboard--sidemenu ${animateOut ? 'animate-out' : ''}`}>

                        <div className='menu--block'>
                            <span className='hamburger--icon' onClick={handleShowSidemenu}>
                                <RiCloseFill />
                            </span>

                            {(width < 600) && (
                                <>
                                    <a href="https://www.luxeware.quicka.store" target='_blank' className='store--btn'>
                                        View Store <MdOutlineStorefront />
                                    </a>

                                    <Line where={'Bottom'} value={'1.6rem'} />
                                </>
                            )}

                            <span className='block--heading'>
                                <p className='heading--text'>Main Access</p>
                            </span>
                            <ul className='menu--list'>
                                <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                                <MenuLink icon={<MdOutlineShoppingBag />} title='Your Orders' link='/orders' />
                                <MenuLink icon={<LuTags />} title='Your Products' link='/products' />
                                <MenuLink icon={<BiLineChart />} title='Store Analytics' link='/analytics' />
                                <MenuLink icon={<RiCoupon3Line />} title='Run sales / coupon' link='/run-sales' />
                                <MenuLink icon={<FiUsers />} title='Your Customers' link='/customers' />
                                <MenuLink icon={<TbTransactionDollar />} title='All Transactions' link='/transactions' />
                                <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                            </ul>
                        </div>

                        <div className='menu--block'>
                            <Line where={'Bottom'} value={'0.34rem'} />

                            <span className='block--heading' onClick={handleShowRemains}>
                                <p className='heading--text' style={{ cursor: 'pointer' }}>Store Settings</p>
                                <div className='heading--icon'>
                                    {showRemains ? <AiOutlineMinus /> : <AiOutlinePlus />}
                                </div>
                            </span>

                            {showRemains && (
                                <ul className='menu--list'>
                                    <MenuLink icon={<MdOutlineStorefront />} title='Store Information' link='/store-info' />
                                    <MenuLink icon={<TbTruckDelivery />} title='Delivery and Rates' link='/delivery-rates' />
                                    <MenuLink icon={<LuGlobe />} title='Custom Domain' link='/custom-domain' />
                                    <MenuLink icon={<HiOutlineSquare3Stack3D />} title='Subscription' link='/subscription' />
                                    <MenuLink icon={<BiCustomize />} title='Site Customisation' link='/store-customisation' />
                                </ul>
                            )}

                            <Line where={'Top'} value={'0.34rem'} />

                        </div>

                        <ul className={`menu--list ${!showRemains ? 'last--menu' : ''}`}>
                            <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' />
                            <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        </ul>
                    </div>
                </>
            )}

        </>
    )
}

export default DashboardMenu