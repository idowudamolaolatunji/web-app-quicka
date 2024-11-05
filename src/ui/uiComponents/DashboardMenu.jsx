import React from 'react';
import MenuLink from './MenuLink';
import Line from '../../components/Line';
import Overlay from '../../components/Overlay';
import MenuButton from './MenuButton';
import { openWidget } from '../../utils/helper';

import { AiOutlineBank, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { LuGlobe, LuLayoutPanelLeft, LuRotate3D, LuTags } from 'react-icons/lu';
import { FiUsers } from 'react-icons/fi';
import { MdChatBubble, MdOutlineCampaign, MdOutlineChatBubbleOutline, MdOutlineDashboard, MdOutlineDeliveryDining, MdOutlineHelp, MdOutlineHelpOutline, MdOutlineSettings, MdOutlineShoppingBag, MdOutlineSsidChart, MdOutlineStorefront, MdOutlineWebhook } from 'react-icons/md';
import { BiCustomize, BiLineChart } from 'react-icons/bi';
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import { useDataContext } from '../../context/DataContext';
import { RiAppsLine, RiBankLine, RiCoupon3Line, RiCloseFill, RiDiscountPercentLine } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { TbDeviceAnalytics, TbTransactionDollar, TbTruckDelivery } from 'react-icons/tb';


function DashboardMenu() {
    const { isMenuCollapsed, showSidemenu, handleShowSidemenu, animateOut } = useDataContext();
    const { width } = useWindowSize()


    return (
        <>
            {width > 900 && (
                <div className='dashboard--menu'>
                    <div className='menu--block'>
                        {!isMenuCollapsed && (
                            <span className='block--heading'>
                                <p className='heading--text'>Menu Access</p>
                            </span>
                        )}
                        <ul className='menu--list'>
                            <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                            <MenuLink icon={<MdOutlineShoppingBag />} title='Your Orders' link='/orders' />
                            <MenuLink icon={<LuTags />} title='Your Products' link='/products' />
                            <MenuLink icon={<TbDeviceAnalytics />} title='Analytics' link='/analytics' />
                            <MenuLink icon={<FiUsers />} title='Your Customers' link='/customers' />
                            <MenuLink icon={<TbTransactionDollar />} title='Transactions' link='/transactions' />
                            <MenuLink icon={<RiDiscountPercentLine />} title='Discount and coupon' link='/discount-coupon' />
                        </ul>
                    </div>

                    <Line where={'Bottom'} value={'0.34rem'} border={1.4} />

                    <ul className={`menu--list`}>
                        <MenuLink icon={<MdOutlineStorefront />} title='Store Information' link='/store-info' />
                        <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                        <MenuLink icon={<TbTruckDelivery />} title='Delivery Rates' link='/delivery-rates' />
                        <MenuLink icon={<MdOutlineCampaign />} title='Campaigns' link='/campaigns' />
                        <MenuLink icon={<LuGlobe />} title='Custom Domain' link='/custom-domain' />
                        <MenuLink icon={<BiCustomize />} title='Store Customisation' link='/store-customisation' />
                    </ul>

                    <Line where={'Top'} value={'0.34rem'} border={1.4} />

                    <ul className={`menu--list`}>
                        <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' />
                        <MenuLink icon={<HiOutlineSquare3Stack3D />} title='Subscription' link='/subscription' />
                        <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        <MenuButton icon={<MdOutlineHelpOutline />} title='Help Center' action={openWidget} />
                    </ul>
                </div>
            )}


            {(width < 900 && showSidemenu) && (
                <>
                    {width >= 600 && <Overlay handleClose={handleShowSidemenu} />}
                    <div className={`dashboard--sidemenu ${animateOut ? 'animate-out' : ''}`}>

                        <div className='menu--block'>
                            <span className='hamburger--icon icon--box' onClick={handleShowSidemenu}>
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
                                <MenuLink icon={<TbDeviceAnalytics />} title='Analytics' link='/analytics' />
                                <MenuLink icon={<FiUsers />} title='Your Customers' link='/customers' />
                                <MenuLink icon={<TbTransactionDollar />} title='Transactions' link='/transactions' />
                                <MenuLink icon={<RiDiscountPercentLine />} title='Discount and coupon' link='/discount-coupon' />
                            </ul>
                        </div>

                        <Line where={'Bottom'} value={'0.34rem'} border={1.4} />

                        <ul className='menu--list'>
                            <MenuLink icon={<MdOutlineStorefront />} title='Store Information' link='/store-info' />
                            <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                            <MenuLink icon={<TbTruckDelivery />} title='Delivery Rates' link='/delivery-rates' />
                            <MenuLink icon={<MdOutlineCampaign />} title='Campaigns' link='/campaigns' />
                            <MenuLink icon={<LuGlobe />} title='Custom Domain' link='/custom-domain' />
                            <MenuLink icon={<BiCustomize />} title='Site Customisation' link='/store-customisation' />
                        </ul>

                        <Line where={'Top'} value={'0.34rem'} border={1.4} />


                        <ul className='menu--list'>
                            <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' />
                            <MenuLink icon={<HiOutlineSquare3Stack3D />} title='Subscription' link='/subscription' />
                            <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        </ul>
                    </div>
                </>
            )}
        </>
    )
}

export default DashboardMenu