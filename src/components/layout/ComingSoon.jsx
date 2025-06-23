import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TiArrowBack } from "react-icons/ti";


function ComingSoon({ feature, action=true, navigateBack=true }) {
    const navigate = useNavigate();

    useEffect(function() {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='coming_soon--container'>
            <h3 className='coming_soon--heading'>Coming Soon...</h3>
            <p className='coming_soon--text'>We'd notify you when the "{feature}" feature is Live!</p>
            {action && (
                <button className='coming_soon--btn' onClick={() => navigate(navigateBack ? -1 : "/")}> <TiArrowBack style={{ fontSize: "2rem" }} /> Go {navigateBack ? "Back" : "Home"}</button>
            )}
        </div>
    )
}



export default ComingSoon
