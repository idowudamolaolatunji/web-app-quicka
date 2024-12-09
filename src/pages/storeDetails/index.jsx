import React, { useEffect, useState } from 'react';

import "./style.css";
import { BiEditAlt } from 'react-icons/bi';
import { useAuthContext } from '../../context/AuthContext';
import { MdOutlinePersonPinCircle, MdOutlineStorefront } from 'react-icons/md';
import { AiOutlineLink } from 'react-icons/ai';
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/ConnectionError';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { useWindowSize } from 'react-use';


function index() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const noLogo = "../../../../faviconB.png"
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { isMenuCollapsed } = useDataContext();
    const { globalConnectionError } = useFetchedContext();

    const isCollapsedBtw900and1000 = !isMenuCollapsed && (width > 900 && width < 1000);
    const { currencies, mainCurrency, description, category, contact, location, logo } = store;
    const logoImg = BASE_URL + logo;
    const { subHeading, heading, headline } = store?.customDetail;
    const currency = currencies[mainCurrency];

    useEffect(function () {
        document.title = "Quicka | Store Details"
        window.scrollTo(0, 0);
    }, []);

    const PreviewHead = function () {
        return (
            <div className='custom--head'>
                <div className="form--element">
                    <span><img src={store?.logo ? logoImg : noLogo} alt="brand logo" /></span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className='custom--labels' style={{ gap: ".6rem" }}>
                        <h3 className='custom--title'>{store?.name}</h3>
                        <a className='custom--link' target='_blank' href={`https://${store?.storeUrl}`} >
                            https://{store?.storeUrl} <AiOutlineLink />
                        </a>
                    </span>
                </div>
            </div>
        )
    }

    return (
        <>
            {globalConnectionError && <ConnectionError />}

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
                            <div className='preview--body-item'>Welcome Heading <span className='preview--body-value'>{subHeading ? `${heading} ${subHeading}` : "--"}</span></div>
                            <div className='preview--body-item'>Top Headline <span className='preview--body-value'>{headline || "--"}</span></div>
                            <div className='preview--body-item'>Store Description <span className='preview--body-value'>{description || "--"}</span></div>
                            <div className='preview--body-item'>Store Category <span className='preview--body-value'>{category || "--"}</span></div>
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
                        <div className='preview--body-item'>Country <span className='preview--body-value'>{location?.country || "--"}</span></div>
                        <div className='preview--body-item'>State <span className='preview--body-value'>{location?.state || "--"}</span></div>
                        <div className='preview--body-item'>Zip Code <span className='preview--body-value'>{location?.zip || "--"}</span></div>
                        <div className='preview--body-item'>Currency <span className='preview--body-value'>{currency?.name}({currency?.symbol})</span></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default index