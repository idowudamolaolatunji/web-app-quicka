import React, { useEffect } from 'react'
import ComingSoon from '../../../components/layout/ComingSoon'

function RunCampaign() {

    useEffect(function () {
        window.scrollTo(0, 0);
        document.title = "Quicka - Run Campaign  | Business Management Tool for SME's"
    }, [])


    return (
        <ComingSoon feature={"Campaign"} />
    )
}

export default RunCampaign