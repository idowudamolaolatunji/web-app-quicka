import React, { useEffect } from 'react'
import ComingSoon from '../../components/layout/ComingSoon';

function index() {

    useEffect(function () {
        window.scrollTo(0, 0);
        document.title = "Quicka | Run Campaign"
    }, [])


    return (
        <ComingSoon feature={"Campaign"} />
    )
}

export default index
