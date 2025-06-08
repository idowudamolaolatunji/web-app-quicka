import React, { useEffect, useState } from 'react'
import BackButton from '../../../components/button/BackButton'
import { useNavigate } from 'react-router-dom'
import { LuBadgeInfo } from 'react-icons/lu';
import Line from '../../../components/elements/Line';
import SpinnerTiny from "../../../components/spinner/Tiny"
import { GoSearch } from "react-icons/go";
import { HiOutlineEnvelope, HiOutlinePhone  } from "react-icons/hi2";
import { BiPurchaseTagAlt } from 'react-icons/bi';


export default function BuyDomain() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState({ tiny: false, main: false })
    const [domainQuery, setDomainQuery] = useState("");
    const [domainResult, setDomainResult] = useState(null)
    const [nameError, setNameError] = useState("");

    useEffect(function() {
        document.title = "Quicka - Buy Domain | Business Management Tool for SME's";
        window.scrollTo(0, 0);
    }, [])

    useEffect(function() {
        async function handleSearch() {
            setLoading({ ...loading, tiny: true });
            
            try {
                
            } catch(err) {
                
            } finally {
                // setLoading({ ...loading, tiny: false });
            }
        }

        if(
            domainQuery.includes(".") && 
            !domainQuery.startsWith(".") && 
            domainQuery.split(".")?.at(1)?.length > 1
        ) {
            handleSearch();
        } else {
            setLoading({ ...loading, tiny: false });
        }

    }, [domainQuery])

    return (
        <section className='product__upload-section'>
            <div className='page__section--heading'>
                <span className="flex" style={{ gap: "1.4rem" }}>
                    <BackButton close={() => navigate(-1)} />
                    <h2 className="page__section--title">Buy Domain <BiPurchaseTagAlt /></h2>
                </span>

            </div>

            {/* <div className="top--bar info" style={{ margin: "-1rem 0 2rem" }}>
                  <Info type="html">
                    <p style={{ marginBottom: ".68rem", fontWeight: 600 }}>To check the availability and price of a domain, simply enter the desired domain name, See examples:</p>
                    <p><li>myshop.ng</li><li>mybusiness.com</li></p>
                  </Info>
              </div> */}

            <div className="top--bar info" style={{ margin: "-1.4rem 0 2.8rem",  }}>
                <span>
                    <p className='sub--text-sub no-hyphens flex-align-top'>
                        <LuBadgeInfo style={{ fontSize: "1.6rem" }} />
                        To check the availability and price of a domain, simply enter the desired domain name in the search input, check examples like:
                    </p>
                    <p className="sub--text-sub" style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
                        - myshop.ng - mybusiness.com - mybrand.com.ng - myoffice.gh - myonlinestore.co.za
                    </p>
                </span>
            </div>


            <div className="item__preview--grid grid--2x1">
                <div className="left--side">
                    <div className="card form">
                        <div className="section--heading">
                            <p>Domain Search</p>
                        </div>

                        <div className="form--item">
                            <div className="domain__search form--input">
                                {loading.tiny ? <SpinnerTiny /> : <GoSearch />}
                                <input type="text" className="domain__search--input" placeholder="Search Domain" value={domainQuery} name='domain' onChange={(e) => setDomainQuery(e.target.value)}  />
                            </div>

                            <span className="form--error-message">
                                {nameError && nameError}
                            </span>
                        </div>

                        <Line border={1.4} where="Top" value="1rem" />

                        {!domainResult && <div style={{ marginBottom: "1.4rem" }} />}
                    </div>

                </div>


                <div className="right--side">
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Need some help?</h2>
                        </div>

                        <div className="domain__support">
                            <p className='support--text'>Our support team are here 24/7 to help you fix any issues you're having and find the perfect domain for your store.</p>

                            <div className="support--options">
                                <span className='support--subtext'>
                                    <HiOutlinePhone  />
                                    <a href="tel:+2349057643470" className='value'>+234 905 7643 470</a>
                                </span>
                                <span className='support--subtext'>
                                    <HiOutlineEnvelope />
                                    <a href="mailto:support@getquicka.com">support@getquicka.com</a>
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}