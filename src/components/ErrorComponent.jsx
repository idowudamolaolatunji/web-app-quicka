import React from 'react';
import { BsPatchExclamation } from 'react-icons/bs';

// import error_img from '../assets/images/resources/orange-error.png'
// import server_img from '../assets/images/resources/orange-server-error-100.png'

function ErrorComponent({ customStyle }) {
    return (
        <div className="error empty--box" style={customStyle}>
            <span><BsPatchExclamation /></span>
            <p>Oops! Connection Error!!</p>
        </div>
    )
}

export default ErrorComponent