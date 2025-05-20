import React from 'react'
import { MdWifiTetheringErrorRounded } from 'react-icons/md'
import { useWindowSize } from 'react-use'
import { useFetchedContext } from '../../context/FetchedContext';

export default function TooManyRequestError() {
    const { width } = useWindowSize();
    const { setRateExceeded } = useFetchedContext();

    return (
        <div className="top--bar warning">
            <div className="sub--mini">
                <MdWifiTetheringErrorRounded style={{ fontSize: '2.6rem', alignSelf: "flex-start", transform: "none", backgroundColor: "transparent", color: "inherit" }} />
                <span className='sub--text'>
                    <span className="flex-align-center">Whoa!, Request Limit Exeeded.. {width <= 450 && <MdWifiTetheringErrorRounded style={{ fontSize: '2.4rem', alignSelf: "flex-start", display: "block", transform: "none", backgroundColor: "transparent", color: "inherit" }} />}</span>
                    <p className='sub--text-sub'>Too many requests from this IP, please wait a little and try again in an hour!</p>
                </span>
            </div>

            <div className="sub--mini">
                <button onClick={() => setRateExceeded(false)} className='sub--btn'>Ok</button>
            </div>
        </div>
    )
}