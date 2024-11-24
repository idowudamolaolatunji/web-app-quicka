import React from 'react';

import error_img from '../assets/images/resources/orange-error.png'
import server_img from '../assets/images/resources/orange-server-error-100.png'

function ErrorComponent({ customStyle, text }) {
    return (
        <div className="error empty--box" style={customStyle}>
            <img src={text?.includes("Server") ? server_img : error_img} alt='' />
            <p>{text}</p>
        </div>
    )
}

export default ErrorComponent