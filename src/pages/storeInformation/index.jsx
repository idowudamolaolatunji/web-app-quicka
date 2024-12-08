import React, { useState } from 'react';

import "./style.css";
import { BiEditAlt } from 'react-icons/bi';
import { useAuthContext } from '../../context/AuthContext';
import { MdOutlinePersonPinCircle, MdOutlineStorefront } from 'react-icons/md';
import { AiOutlineLink } from 'react-icons/ai';
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/ConnectionError';


function index() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const noLogo = "../../../../faviconB.png"
    const { store } = useAuthContext();
    const { globalConnectionError } = useFetchedContext();
    
    const { currencies, mainCurrency, description, category, contact, location, logo } = store;
    const logoImg = BASE_URL + logo;
    const { subHeading, heading, headline } = store?.customDetail;
    const currency = currencies[mainCurrency];


    return (
        <>
            {globalConnectionError && <ConnectionError />}

            <div className='page__section--heading'>
                <h2 className="page__section--title">Store Information</h2>

                <span className='page__section--btns'>
                    <button className="page__section-top-btn add" onClick={() => { }}>
                        Edit Information <BiEditAlt />
                    </button>
                </span>
            </div>


            <div className="preview--grid">
                <div>
                    <div className="preview--figure" style={{ marginBottom: "2rem" }}>
                        <div className='custom--head' style={{ flexDirection: "row", alignItems: "center", gap: 0 }}>
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
                    </div>

                    <div className="preview--figure">
                        <span className="preview--figure-title">
                            <MdOutlineStorefront /> Store Information
                        </span>

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
                        <MdOutlinePersonPinCircle /> Store Contact / Location
                    </span>

                    <div className="preview--body">
                        <div className='preview--body-item'>Email-address <span className='preview--body-value'>{contact?.email}</span></div>
                        <div className='preview--body-item'>Phone No. <span className='preview--body-value value'>+{contact?.phone}</span></div>
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