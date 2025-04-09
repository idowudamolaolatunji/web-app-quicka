import React from 'react';
import MenuLink from './MenuLink';
import Line from '../../../components/elements/Line';
import Overlay from '../../../components/layout/Overlay';
import MenuButton from './MenuButton';
import { openWidget, truncateString } from '../../../utils/helper';

import { AiOutlineBank } from 'react-icons/ai';
import { LuGlobe, LuLayoutPanelLeft, LuTags } from 'react-icons/lu';
import { FiUsers } from 'react-icons/fi';
import { MdChatBubble, MdOutlineCampaign, MdOutlineChatBubbleOutline, MdOutlineDashboard, MdOutlineDeliveryDining, MdOutlineHelp, MdOutlineHelpOutline, MdOutlineSettings, MdOutlineShoppingBag, MdOutlineSsidChart, MdOutlineStorefront, MdOutlineWebhook } from 'react-icons/md';
import { BiCustomize, BiLineChart, BiMailSend } from 'react-icons/bi';
import { useDataContext } from '../../../context/DataContext';
import { RiAppsLine, RiCloseFill, RiDiscountPercentLine, RiStackLine } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { TbDeviceAnalytics, TbPresentationAnalytics, TbTransactionDollar, TbTruckDelivery, TbWorldWww } from 'react-icons/tb';
import { PiCoins, PiCoinsBold } from 'react-icons/pi';
import { useAuthContext } from '../../../context/AuthContext';
import { SlGlobe } from 'react-icons/sl';
import TooltipUI from '../../../components/layout/TooltipUI';
import { HiOutlineShoppingCart } from "react-icons/hi";



export default function DashboardMenu() {
    const { isMenuCollapsed, showSidemenu, handleShowSidemenu, animateOut } = useDataContext();
    const { width } = useWindowSize();
    const { store } = useAuthContext();

    return (
        <>
            {width > 900 && (
                <div className='dashboard--menu'>
                    <div className='menu--block'>

                       <TooltipUI title="Visit Your Store" placement={isMenuCollapsed ? "right" : "bottom"}>
                            <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                <SlGlobe /> {!isMenuCollapsed ? truncateString(store?.storeUrl, 24) : ""}
                            </a>
                        </TooltipUI>


                        {!isMenuCollapsed && (
                            <span className='block--heading'>
                                <p className='heading--text'>Menu Access</p>
                            </span>
                        )}
                        <ul className='menu--list'>
                            <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                            <MenuLink icon={<HiOutlineShoppingCart />} title='Orders / Sales' link='/orders' />
                            <MenuLink icon={<LuTags />} title='Products' link='/products' />
                            <MenuLink icon={<FiUsers />} title='Customers' link='/customers' />
                            <MenuLink icon={<AiOutlineBank />} title='Transactions' link='/transactions' />
                            <MenuLink icon={<RiDiscountPercentLine />} title='Coupons / Discounts' link='/promotions' />
                            <MenuLink icon={<TbPresentationAnalytics />} title='Analytics' link='/analytics' />
                        </ul>
                    </div>

                    <Line where={'Bottom'} value={'0.34rem'} border={1.4} />

                    <ul className={`menu--list`}>
                        <MenuLink icon={<MdOutlineStorefront />} title='Store Details' link='/store-details' />
                        <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                        <MenuLink icon={<TbTruckDelivery />} title='Delivery Rates' link='/delivery-rates' />
                        <MenuLink icon={<BiMailSend />} title='Campaigns' link='/campaigns' />
                        <MenuLink icon={<PiCoinsBold />} title='Expenses' link='/expenses' />
                        <MenuLink icon={<TbWorldWww />} title='Custom Domain' link='/custom-domain' />
                        <MenuLink icon={<BiCustomize />} title='Store Customization' link='/store-customization' />
                    </ul>

                    <Line where={'Top'} value={'0.34rem'} border={1.4} />

                    <ul className={"menu--list"}>
                        {/* <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' /> */}
                        {/* <MenuLink icon={<MdOutlineCampaign />} title='Referrals' link='/referrals' /> */}
                        <MenuLink icon={<RiStackLine />} title='Subscription' link='/subscription' />
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

                            <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                <SlGlobe /> {store?.storeUrl}
                            </a>

                            <Line where={'Bottom'} value={'1.6rem'} />
                              

                            <span className='block--heading'>
                                <p className='heading--text'>Main Access</p>
                            </span>
                            <ul className='menu--list'>
                                <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                                <MenuLink icon={<HiOutlineShoppingCart />} title='Orders / Sales' link='/orders' />
                                <MenuLink icon={<LuTags />} title='Products' link='/products' />
                                <MenuLink icon={<FiUsers />} title='Customers' link='/customers' />
                                <MenuLink icon={<AiOutlineBank />} title='Transactions' link='/transactions' />
                                <MenuLink icon={<RiDiscountPercentLine />} title='Coupons / Discounts' link='/promotions' />
                                <MenuLink icon={<TbPresentationAnalytics />} title='Analytics' link='/analytics' />
                            </ul>
                        </div>

                        <Line where={'Bottom'} value={'0.34rem'} border={1.4} />

                        <ul className='menu--list'>
                            <MenuLink icon={<MdOutlineStorefront />} title='Store Details' link='/store-details' />
                            <MenuLink icon={<RiAppsLine />} title='Integrated App' link='/integrated-apps' />
                            <MenuLink icon={<TbTruckDelivery />} title='Delivery Rates' link='/delivery-rates' />
                            <MenuLink icon={<PiCoinsBold />} title='Expenses' link='/expenses' />
                            <MenuLink icon={<BiMailSend />} title='Campaigns' link='/campaigns' />
                            <MenuLink icon={<TbWorldWww />} title='Custom Domain' link='/custom-domain' />
                            <MenuLink icon={<BiCustomize />} title='Site Customization' link='/store-customization' />
                        </ul>

                        <Line where={'Top'} value={'0.34rem'} border={1.4} />


                        <ul className='menu--list'>
                            {/* <MenuLink icon={<MdOutlineChatBubbleOutline />} title='Community and Forums' link='/community-forums' /> */}
                            {/* <MenuLink icon={<MdOutlineCampaign  />} title='Referrals' link='/referrals' /> */}
                            <MenuLink icon={<RiStackLine />} title='Subscription' link='/subscription' />
                            <MenuLink icon={<MdOutlineSettings />} title='Settings' link='/settings' />
                        </ul>
                    </div>
                </>
            )}
        </>
    )
}