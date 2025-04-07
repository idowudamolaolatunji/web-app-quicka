import React, { useEffect, useState } from 'react'
import BackButton from '../../../components/button/BackButton'
import { useNavigate } from 'react-router-dom'
import { LuBadgeInfo } from 'react-icons/lu';
import Line from '../../../components/elements/Line';
import SpinnerTiny from "../../../components/spinner/tiny"
import { HiOutlineEnvelope, HiOutlinePhone  } from "react-icons/hi2";
import { GrConnect } from "react-icons/gr";


export default function ConnectDomain() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState({ tiny: false, main: false })
    const [domainQuery, setDomainQuery] = useState("");

    useEffect(function() {
      document.title = "Quicka | Connect a domain";
      window.scrollTo(0, 0);
    }, [])

    return (
        <section className='product__upload-section'>
            <div className='page__section--heading'>
                <span className="flex" style={{ gap: "1.4rem" }}>
                    <BackButton close={() => navigate(-1)} />
                    <h2 className="page__section--title">Connect Domain <GrConnect /></h2>
                </span>

            </div>

            <div className="top--bar info" style={{ margin: "-1.4rem 0 2.8rem",  }}>
                <span>
                    <p className='sub--text-sub no-hyphens flex-align-top'>
                        <LuBadgeInfo style={{ fontSize: "1.6rem" }} />
                        Once you link your domain to your store, your existing website URL will automatically be updated to reflect the new domain
                    </p>
                    <p className="sub--text-sub" style={{ fontSize: "1.2rem", marginLeft: "1rem", color: "#444" }}>
                       Are you facing any issue?{"  "}
                       <a href="mailto:support@getquicka.com" style={{ textDecoration: "underline" }}>support@getquicka.com</a>
                    </p>
                </span>
            </div>


            {/* <div className="item__preview--grid grid--2x1">
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

                    </div>

                </div>


                <div className="right--side">
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Need some help?</h2>
                        </div>

                        <div className="domain__support">
                            <p className='support--text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, laborum.</p>

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
            </div> */}
        </section>
    )
}