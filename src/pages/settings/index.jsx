import React, { useEffect } from 'react'

export default function index() {
    useEffect(function() {
        document.title = "Quicka - Buy Domain | Business Management Tool for SME's";
        window.scrollTo(0, 0);
    }, [])

    return (
        <React.Fragment>
            <div className='page__section--heading'>
                <h2 className="page__section--title">Settings</h2>
            </div>
        </React.Fragment>
    )
}