import React, { useEffect } from 'react'
import ComingSoon from '../../../components/layout/ComingSoon';

export default function RunSpecialSales() {

    useEffect(function () {
        window.scrollTo(0, 0);
        document.title = "Quicka | Run Special Sales"
    }, [])

    return (
        <ComingSoon feature={"Special Sales"} />
    )
}
