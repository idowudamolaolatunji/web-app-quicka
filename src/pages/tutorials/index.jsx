import React, { useEffect } from 'react'
import ComingSoon from '../../components/layout/ComingSoon'

export default function index() {

    useEffect(function () {
        document.title = "Quicka - Tutorial Knowledge base | Business Management Tool for SME's";
        window.scrollTo(0, 0);
    }, [])

    return (
        <ComingSoon feature="Tutorials" navigateBack={false} />
    )
}
