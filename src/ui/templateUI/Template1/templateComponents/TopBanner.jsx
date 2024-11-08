import React from 'react'
import noBanner from "../../../../assets/images/resources/banner.jpg"

function TopBanner({ banner, heading, text }) {
    return (
        <div className='template__banner' style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url(${banner || noBanner})` }}>
            <h1>{heading || "Banner Heading Goes here"}</h1>
            <p>{text || "Banner subText goes here"}</p>
        </div>
    )
}

export default TopBanner