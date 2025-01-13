import React from 'react';
import './style.css'
import { useWindowSize } from 'react-use';

function index() {
    const { width } = useWindowSize();
    return (
        <div className="spinner--container">
            <div className="main_spinner" style={width > 850  ? { 
                transform: 'translateY(13rem)'
            } : { 
                transform: 'translateY(2rem)'
            }}>
                <div className="cube"><div className="cube__inner"></div></div>
                <div className="cube"><div className="cube__inner"></div></div>
                <div className="cube"><div className="cube__inner"></div></div>
            </div>
        </div>
    )
}

export default index