import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import MenuLink from './MenuLink';
import Line from '../../../components/elements/Line';
import Overlay from '../../../components/layout/Overlay';
import MenuButton from './MenuButton';
import { cap1stLetter, openWidget, truncateString } from '../../../utils/helper';

import { AiOutlineBank } from 'react-icons/ai';
import { LuLayoutPanelLeft, LuTags } from 'react-icons/lu';
import { FiUsers } from 'react-icons/fi';
import { MdBusiness, MdChatBubble, MdOutlineAddBusiness, MdOutlineCampaign, MdOutlineChatBubbleOutline, MdOutlineDashboard, MdOutlineDeliveryDining, MdOutlineHelp, MdOutlineHelpOutline, MdOutlineSettings, MdOutlineShoppingBag, MdOutlineStorefront } from 'react-icons/md';
import { BiCustomize, BiMailSend } from 'react-icons/bi';
import { useDataContext } from '../../../context/DataContext';
import { RiAppsLine, RiCloseFill, RiDiscountPercentLine, RiProgress1Line, RiStackLine, RiVerifiedBadgeLine } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { TbPresentationAnalytics, TbTruckDelivery, TbWorldWww } from 'react-icons/tb';
import { PiCoinsBold, PiNetwork } from 'react-icons/pi';
import { useAuthContext } from '../../../context/AuthContext';
import { SlGlobe } from 'react-icons/sl';
import TooltipUI from '../../../components/layout/TooltipUI';
import { HiOutlineShoppingCart } from "react-icons/hi";
import IntialsImage from '../../../components/layout/IntialsImage';
import { IoIosArrowDown, IoIosArrowUp, IoMdCheckmark } from 'react-icons/io';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { useNavigate } from 'react-router-dom';
import SwitchLoader from '../../../components/spinner/switching';
import { useFetchedContext } from '../../../context/FetchedContext';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function DashboardMenu() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { globalConnectionError } = useFetchedContext();
    const { user, store, headers, handleStore, handleUser, setShouldLoad } = useAuthContext();
    const { isMenuCollapsed, showSidemenu, animateOut, handleShowSidemenu } = useDataContext();
    const ref = useOutsideClick(handleToggleStoreDropdown);
    
    const [storeDropdown, setStoreDropdown] = useState(false);
    const [switchingLoader, setSwitchingLoader] = useState(false);


    function handleToggleStoreDropdown() {
        if(globalConnectionError) return
        setStoreDropdown(!storeDropdown);
    }

    const navigateToManageBusiness = function() {
        navigate("/manage-business");
    }

    const handleSwitchStore = async function(slug) {
        handleToggleStoreDropdown();

        if(slug == store?.slug) {
            setTimeout(function() {
                navigate("/dashboard");
            }, 250);
        }
        
        if(slug != store?.slug) {
            setSwitchingLoader(true);
            const res = await fetch(`${BASE_API_URL}/stores/mine/outlet?slug=${slug}`, {
                method: "GET", headers
            });
            const data = await res.json();
            setSwitchingLoader(false);
            if(!data?.status || !res.ok) return
            setShouldLoad(true);
            handleStore(data?.data?.store);
            handleUser(data?.data?.auth);
            navigate("/dashboard");
        }
        window.scrollTo(0, 0);
        handleShowSidemenu();
    }

    return (
        <React.Fragment>
            {switchingLoader && (
                createPortal(<SwitchLoader />, document.body)
            )}

            {width > 900 && (
                <div className='dashboard--menu'>
                    <div className='menu--block'>

                        {!isMenuCollapsed ? (
                            <div className="menu--store">
                                <IntialsImage type="store" store={store} />

                                <span className="menu--store-detail">
                                    <p className='text'>{truncateString(store?.name, 22)}</p>
                                    {store?.storeOnboardCompleted ? (
                                        <TooltipUI title="Visit Your Store" placement="bottom">
                                            <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                                {truncateString(store?.storeUrl, 18)}
                                            </a>
                                        </TooltipUI>
                                    ) : (
                                        <p className='status progress'>In progress <RiProgress1Line /></p>
                                    )}
                                </span>

                                <button className="menu--action" onClick={handleToggleStoreDropdown}>
                                    <MdBusiness />
                                    <p className='value'>{user?.stores?.length || 1}</p>
                                    {!storeDropdown ? <IoIosArrowDown /> : <IoIosArrowUp />}
                                </button>

                                {storeDropdown && (
                                    <div className='menu--store-dropdown' ref={ref} style={{ top: "110%" }}>
                                        {user?.stores?.map(myStore => (
                                            <div className={`menu--store ${myStore?._id == store?._id ? "is-current" : ""}`} key={myStore?._id} onClick={() => handleSwitchStore(myStore?.slug)}>
                                                <IntialsImage type="store" store={myStore} />
    
                                                <span className="menu--store-detail">
                                                    <p className='text'>{truncateString(myStore?.name, 18)}</p>
                                                    {(myStore?._id == store?._id && store?.storeOnboardCompleted) && (
                                                        <p className='status active'>Active <RiVerifiedBadgeLine /></p>
                                                    )}
                                                </span>
    
                                                <div className="menu--store-select">
                                                    <IoMdCheckmark />
                                                </div>
                                            </div>
                                        ))}
                                       
                                        <button className="menu--store-manage-btn" onClick={navigateToManageBusiness}>
                                            <MdOutlineAddBusiness /> Manage your businesses
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="menu--store" style={{ flexDirection: "column", alignItems: "center", gap: ".6rem" }} onMouseLeave={() => setStoreDropdown(false)}>
                                <IntialsImage type="store" store={store} />
                                <TooltipUI title={store?.storeOnboardCompleted ? "Visit Your Store" : "Onboarding In Progress"} placement="right">
                                    {store?.storeOnboardCompleted ? (
                                        <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'><SlGlobe /></a>
                                    ) : (
                                        <p className='status progress'><RiProgress1Line style={{ fontSize: "2rem", cursor: "progress" }} /></p>
                                    )}
                                </TooltipUI>
                                <button className="menu--action" style={{ padding: ".3rem .6rem"}} onClick={handleToggleStoreDropdown}>
                                    <p className='value'>{user?.stores?.length || 1}</p>
                                    <IoIosArrowDown />
                                </button>

                                {storeDropdown && (
                                    <div className='menu--store-dropdown' ref={ref} style={{ padding: ".4rem .2rem"}}>
                                        {user?.stores?.map(myStore => (
                                            <TooltipUI title={cap1stLetter(myStore?.name)} placement="right" key={myStore?._id}>
                                                <div className={`menu--store ${myStore?._id == store?._id ? "is-current" : ""}`} style={{ padding: ".4rem .2rem"}} onClick={() => handleSwitchStore(myStore?.slug)}>
                                                    <IntialsImage type="store" store={myStore} />
                                                </div>
                                            </TooltipUI>
                                        ))}

                                        <TooltipUI title="Manage Your Businesses" placement="right">
                                            <button className="menu--store-manage-btn" onClick={navigateToManageBusiness}>
                                                <MdOutlineAddBusiness />
                                            </button>
                                        </TooltipUI>
                                    </div>
                                )}
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
                            <MenuLink icon={<PiNetwork />} title='Suppliers' link='/suppliers' />
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

                            <div className="menu--store">
                                <IntialsImage type="store" store={store} />

                                <span className="menu--store-detail">
                                    <p className='text'>{truncateString(store?.name, width < 450 ? 25 : 30)}</p>
                                    {store?.storeOnboardCompleted ? (
                                        <a href={`https://${store?.storeUrl}`} target='_blank' className='link--btn'>
                                            {truncateString(store?.storeUrl, width < 450 ? 28 : 35)}
                                        </a>
                                    ) : (
                                        <p className='status progress'>In progress <RiProgress1Line /></p>
                                    )}
                                </span>

                                <button className="menu--action" onClick={handleToggleStoreDropdown}>
                                    <MdBusiness />
                                    <p className='value'>{user?.stores?.length || 1}</p>
                                    <IoIosArrowDown />
                                </button>

                                {storeDropdown && (
                                    <div className='menu--store-dropdown' ref={ref}>
                                        {user?.stores?.map(myStore => (
                                            <div className={`menu--store ${myStore?._id == store?._id ? "is-current" : ""}`} key={myStore?._id} onClick={() => handleSwitchStore(myStore?.slug)}>
                                                <IntialsImage type="store" store={myStore} />

                                                <span className="menu--store-detail">
                                                    <p className='text'>{truncateString(myStore?.name, 22)}</p>
                                                    {(myStore?._id == store?._id && store?.storeOnboardCompleted) && (
                                                        <p className='status active'>Active <RiVerifiedBadgeLine /></p>
                                                    )}
                                                </span>

                                                <div className="menu--store-select">
                                                    <IoMdCheckmark />
                                                </div>
                                            </div>
                                        ))}

                                        <button className="menu--store-manage-btn" onClick={navigateToManageBusiness}>
                                            <MdOutlineAddBusiness /> Manage your businesses
                                        </button>
                                    </div>
                                )}
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
                                <MenuLink icon={<PiNetwork />} title='Suppliers' link='/suppliers' />
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
        </React.Fragment>
    )
}