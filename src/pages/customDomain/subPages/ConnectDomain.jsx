import React, { useEffect, useState } from 'react'
// import BackButton from '../../../components/button/BackButton'
// import { useNavigate } from 'react-router-dom'
// import { LuBadgeInfo } from 'react-icons/lu';
// import Line from '../../../components/elements/Line';
// import SpinnerTiny from "../../../components/spinner/Tiny"
// import { GrConnect } from "react-icons/gr";
// import { useWindowSize } from 'react-use';
import ComingSoon from '../../../components/layout/ComingSoon';


export default function ConnectDomain() {
    // const { width } = useWindowSize();
    // const navigate = useNavigate()
    // const [loading, setLoading] = useState({ tiny: false, main: false })
    // const [domainQuery, setDomainQuery] = useState("");

    useEffect(function () {
        document.title = "Quicka - Connect Domain | Business Management Tool for SME's";
        window.scrollTo(0, 0);
    }, [])

    return (
        // <section className='product__upload-section'>
        //     <div className='page__section--heading'>
        //         <span className="flex" style={{ gap: "1.4rem" }}>
        //             <BackButton close={() => navigate(-1)} />
        //             <h2 className="page__section--title">Connect Domain <GrConnect /></h2>
        //         </span>

        //     </div>

        //     <div className="top--bar info" style={{ margin: "-1.4rem 0 2.8rem", }}>
        //         <span>
        //             <p className='sub--text-sub no-hyphens flex-align-top'>
        //                 <LuBadgeInfo style={{ fontSize: "1.6rem" }} />
        //                 Once you link your domain to your store, your existing website URL will automatically be updated to reflect the new domain
        //             </p>
        //             <p className="sub--text-sub" style={{ fontSize: "1.2rem", marginLeft: "1rem", color: "#444" }}>
        //                 Are you facing any issue?{"  "}
        //                 <a href="mailto:support@getquicka.com" style={{ textDecoration: "underline" }}>support@getquicka.com</a>
        //             </p>
        //         </span>
        //     </div>


        //     <form className="product__upload--container" onSubmit={e => e.preventDefault()}
        //         style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "75rem", marginTop: width > 600 ? "4rem" : "0" }}
        //     >
        //         {width < 400 && <Line border={1.4} />}

        //         <div className="card form">
        //             <div className="section--heading">
        //                 <h2>Donmain Connection</h2>
        //                 {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
        //             </div>


        //             <div className="form--item">

        //             </div>

        //         </div>

        //     </form>
        // </section>

        <ComingSoon feature="Conect Custom Domain" />
    )
}