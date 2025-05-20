import React from 'react'
import { useWindowSize } from 'react-use'
import { AiOutlineDisconnect } from 'react-icons/ai';

export default function InternetConnectionError() {
    const { width } = useWindowSize();

    return (
        <div className="top--bar error">
            <div className="sub--mini">
                <AiOutlineDisconnect style={{ fontSize: '2.6rem' }} />
                <span className='sub--text'>
                    Oops! Internet Connection Disconnected!
                    <p className='sub--text-sub'>Your internet connection seems turned off, Please re-connect your internect connection</p>
                </span>
            </div>

            <div className="sub--mini">
                {width <= 450 && <AiOutlineDisconnect style={{ fontSize: '2.6rem' }} />}
            </div>
        </div>
    )
}