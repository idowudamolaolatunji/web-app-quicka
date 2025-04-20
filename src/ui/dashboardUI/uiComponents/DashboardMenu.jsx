import React from 'react';
import MenuLink from './MenuLink';
import Line from '../../../components/elements/Line';
import Overlay from '../../../components/layout/Overlay';
import MenuButton from './MenuButton';
import { openWidget, truncateString } from '../../../utils/helper';

import { AiOutlineBank } from 'react-icons/ai';
import { LuLayoutPanelLeft, LuTags } from 'react-icons/lu';
import { FiUsers } from 'react-icons/fi';
import { MdBusiness, MdChatBubble, MdOutlineCampaign, MdOutlineChatBubbleOutline, MdOutlineDashboard, MdOutlineDeliveryDining, MdOutlineHelp, MdOutlineHelpOutline, MdOutlineSettings, MdOutlineShoppingBag, MdOutlineStorefront } from 'react-icons/md';
import { BiCustomize, BiMailSend } from 'react-icons/bi';
import { useDataContext } from '../../../context/DataContext';
import { RiAppsLine, RiCloseFill, RiDiscountPercentLine, RiStackLine } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { TbPresentationAnalytics, TbTruckDelivery, TbWorldWww } from 'react-icons/tb';
import { PiCoinsBold } from 'react-icons/pi';
import { useAuthContext } from '../../../context/AuthContext';
import { SlGlobe } from 'react-icons/sl';
import TooltipUI from '../../../components/layout/TooltipUI';
import { HiOutlineShoppingCart } from "react-icons/hi";
import IntialsImage from '../../../components/layout/IntialsImage';
import { TbSitemap } from "react-icons/tb";
import { IoIosArrowDown } from 'react-icons/io';



export default function DashboardMenu() {
    const { isMenuCollapsed, showSidemenu, handleShowSidemenu, animateOut } = useDataContext();
    const { width } = useWindowSize();
    const { store } = useAuthContext();

    return (
        <>
            {width > 900 && (
                <div className='dashboard--menu'>
                    <div className='menu--block'>

                        {!isMenuCollapsed ? (
                            <div className="menu--store">
                                <IntialsImage type="store" />

                                <span className="menu--store-detail">
                                    <p className='text'>{truncateString(store?.name, 22)}</p>
                                    <TooltipUI title="Visit Your Store" placement="bottom">
                                        <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                            {truncateString(store?.storeUrl, 24)}
                                        </a>
                                    </TooltipUI>
                                </span>

                                <div className="menu--action">
                                    <MdBusiness />
                                    <p className='value'>1</p>
                                    <IoIosArrowDown />
                                </div>
                            </div>
                        ) : (
                            <div className="menu--store" style={{ flexDirection: "column", alignItems: "center", gap: ".6rem" }}>
                                <IntialsImage type="store" />
                                <TooltipUI title="Visit Your Store" placement="right">
                                    <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'><SlGlobe /></a>
                                </TooltipUI>
                                <div className="menu--action" style={{ padding: ".3rem .6rem"}}>
                                    <p className='value'>1</p>
                                    <IoIosArrowDown />
                                </div>
                            </div>
                        )}


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
                            <MenuLink icon={<TbSitemap />} title='Suppliers' link='/suppliers' />
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
                        <MenuLink icon={<RiStackLine />} title='Subscription' link='/subscription' />
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

                            {/* <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                <SlGlobe /> {store?.storeUrl}
                            </a> */}

                            <div className="menu--store">
                                <IntialsImage type="store" />

                                <span className="menu--store-detail">
                                    <p className='text'>{truncateString(store?.name, width < 450 ? 25 : 30)}</p>
                                    <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                        {truncateString(store?.storeUrl, width < 450 ? 28 : 35)}
                                    </a>
                                </span>

                                <div className="menu--action">
                                    <MdBusiness />
                                    <p className='value'>1</p>
                                    <IoIosArrowDown />
                                </div>
                            </div>

                            <Line where={'Bottom'} value={'1.6rem'} />
                              

                            <span className='block--heading'>
                                <p className='heading--text'>Main Access</p>
                            </span>
                            <ul className='menu--list'>
                                <MenuLink icon={<LuLayoutPanelLeft />} title='Dashboard' link='/' />
                                <MenuLink icon={<HiOutlineShoppingCart />} title='Orders / Sales' link='/orders' />
                                <MenuLink icon={<LuTags />} title='Products' link='/products' />
                                <MenuLink icon={<FiUsers />} title='Customers' link='/customers' />
                                <MenuLink icon={<TbSitemap />} title='Suppliers' link='/suppliers' />
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
                            <MenuLink icon={<RiStackLine />} title='Subscription' link='/subscription' />
                        </ul>
                    </div>
                </>
            )}
        </>
    )
}