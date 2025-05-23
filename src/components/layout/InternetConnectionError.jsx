import React from 'react'
import { useWindowSize } from 'react-use'
import { MdSignalWifiConnectedNoInternet1 } from 'react-icons/md';
import { useFetchedContext } from '../../context/FetchedContext';
import { useCheckInternetConnection } from '../../hooks/useCheckInternetConnection';


export function InternetConnectionErrorMini({ removeExcessMargin=true }) {
  return (
    <div className="top--bar error" style={{
        ...(removeExcessMargin ? { marginTop: "-1rem", marginBottom: ".6rem" } : {}),
        padding: "1.2rem 1rem"
    }}>
        <div className="sub--mini" style={{ justifyContent: "flex-start", gap: "1.28rem" }}>
            <MdSignalWifiConnectedNoInternet1 style={{ fontSize: '2.6rem', display: "inline-block" }} />
            <span className='sub--text'>
                Oops! Internet Disconnected!
            </span>
        </div>
    </div>
  )
}

export default function InternetConnectionError() {
    const { width } = useWindowSize();
    const { handleGlobalRefetch } = useFetchedContext();
    const internetStatus = useCheckInternetConnection();

    return (
        <div className="top--bar error">
            <div className="sub--mini">
                <MdSignalWifiConnectedNoInternet1 style={{ fontSize: '2.6rem' }} />
                <span className='sub--text'>
                    Oops! Internet Disconnected!
                    <p className='sub--text-sub'>Your internet connection seems turned off, Please re-connect your internect connection</p>
                </span>
            </div>

            <div className="sub--mini">
                {width <= 450 && <MdSignalWifiConnectedNoInternet1 style={{ fontSize: '2.6rem' }} />}
                {internetStatus == "online" && (
                    <button onClick={handleGlobalRefetch} className='sub--btn'>Reload App</button>
                )}
            </div>
        </div>
    )
}