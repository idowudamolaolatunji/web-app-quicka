import React, { useEffect, useState } from 'react';

import "./style.css";
import { BiEditAlt } from 'react-icons/bi';
import { useAuthContext } from '../../context/AuthContext';
import { MdOutlinePersonPinCircle, MdOutlineStorefront } from 'react-icons/md';
import { AiOutlineLink } from 'react-icons/ai';
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/layout/ConnectionError';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { useWindowSize } from 'react-use';
import { joinedSinceFormat } from '../../utils/helper';
import Spinner from '../../components/spinner/mainSpinner';
import moment from 'moment';


function index() {
    const noLogo = "../../../../faviconB.png"
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { isMenuCollapsed } = useDataContext();
    const { globalConnectionError, loader } = useFetchedContext();

    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1000);
    const { paymentCurrencies, paymentMainCurrency, description, category, contact, location, storeLogo } = store;
    const { subHeading, heading, headline, slogan } = store?.customDetail;
    const currency = paymentCurrencies[paymentMainCurrency];
      
    useEffect(function () {
        document.title = "Quicka | Store Details"
        window.scrollTo(0, 0);
    }, []);

    
    const PreviewHead = function () {
        return (
            <div className='custom--head'>
                <div className="form--element">
                    <span><img src={storeLogo?.url ? storeLogo?.url : noLogo} alt="brand logo" /></span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className='custom--labels' style={{ gap: ".6rem" }}>
                        <h3 className='custom--title'>{store?.name}</h3>
                        <a className='custom--link' target='_blank' href={`https://${store?.storeUrl}`} >
                            www.{store?.storeUrl} <AiOutlineLink />
                        </a>
                        <p style={{ fontSize: "1.28rem", padding: "0" }} className='preview--body-item'>
                            {joinedSinceFormat(store?.createdAt)}
                        </p>
                    </span>
                </div>
            </div>
        )
    }

    return (
        <>
            {globalConnectionError && <ConnectionError />}

            {loader?.store && <Spinner />}

            <div className='page__section--heading' style={width <= 450 ? { flexDirection: "column", alignItems: "flex-start", gap: "2rem" } : {}}>
                <h2 className="page__section--title">Store Details</h2>

                <span style={width <= 450 ? { width: "100%" } : {}}>
                    <button className="page__section-top-btn add" onClick={() => navigate("edit")}>
                        Edit Details <BiEditAlt />
                    </button>
                </span>
            </div>


            <div className={`preview--grid ${isCollapsedBtw900and1000 ? 'column-1fr' : ''}`}>
                <div>
                    {width > 450 && (
                        <div className="preview--figure" style={{ marginBottom: "2rem" }}>
                            <PreviewHead />
                        </div>
                    )}

                    <div className="preview--figure">
                        <span className="preview--figure-title">
                            <MdOutlineStorefront /> Store Information
                        </span>

                        {width <= 450 && (
                            <PreviewHead />
                        )}

                        <div className="preview--body">
                            <div className='preview--body-item'>Business slogan <span className='preview--body-value'>{slogan || "--"}</span></div>
                            <div className='preview--body-item'>Welcome Heading <span className='preview--body-value'>{subHeading ? `${heading} ${subHeading}` : "--"}</span></div>
                            <div className='preview--body-item'>Top Headline <span className='preview--body-value'>{headline || "--"}</span></div>
                            <div className='preview--body-item'>Business Description <span className='preview--body-value'>{description || "--"}</span></div>
                            <div className='preview--body-item'>Business Category <span className='preview--body-value'>{category?.name ? category?.name : "--"}</span></div>
                        </div>
                    </div>
                </div>


                <div className="preview--figure">
                    <span className="preview--figure-title">
                        <MdOutlinePersonPinCircle style={{ fontSize: "2.8rem" }} /> Store Contact / Location
                    </span>

                    <div className="preview--body">
                        <div className='preview--body-item'>Email-address <span className='preview--body-value'>{contact?.email}</span></div>
                        <div className='preview--body-item'>Phone No. <span className='preview--body-value'>+{contact?.phone}</span></div>
                        <div className='preview--body-item'>Address <span className='preview--body-value'>{location?.address || "--"}</span></div>
                        <div className='preview--body-item'>Country <span className='preview--body-value'>{location?.country?.name || "--"}</span></div>
                        <div className='preview--body-item'>City & State <span className='preview--body-value'>{location?.state?.name ? `${location?.city?.name + ", "}${location?.state?.name}` : "--"}</span></div>
                        <div className='preview--body-item'>Zip Code <span className='preview--body-value'>{location?.zip || "--"}</span></div>
                        <div className='preview--body-item'>Payment Currency <span className='preview--body-value'>{currency?.name}({currency?.symbol})</span></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default index