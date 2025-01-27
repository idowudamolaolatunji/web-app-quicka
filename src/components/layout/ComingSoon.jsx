import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TiArrowBack } from "react-icons/ti";


function ComingSoon({ feature }) {
    const navigate = useNavigate();

  return (
    <div className='coming_soon--container'>
        <h3 className='coming_soon--heading'>Coming Soon</h3>
        <p className='coming_soon--text'>We'd notify you where {feature} feature is Live!</p>
        <button className='coming_soon--btn' onClick={() => navigate(-1)}> <TiArrowBack style={{ fontSize: "2rem" }} /> Go Back</button>
    </div>
  )
}



export default ComingSoon
