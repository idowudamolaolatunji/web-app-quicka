import React from 'react';
import './style.css'

function index() {
    return (
        <div className="spinner--container" role="presentation">
            <div className="spinner_one">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}

export default index