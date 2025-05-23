import React from 'react'
import { useFetchedContext } from '../../context/FetchedContext'
import { useWindowSize } from 'react-use'
import { BsPatchExclamation } from 'react-icons/bs';

export default function GeneralFetchError() {
    const { width } = useWindowSize();
    const { handleGlobalRefetch } = useFetchedContext()

    const handleRefreshAll = function () {
        handleGlobalRefetch();
    }

    return (
        <div className="top--bar error">
            <div className="sub--mini">
                <BsPatchExclamation style={{ fontSize: '2.4rem' }} />
                <span className='sub--text'>
                    Oops! Something Went Wrong!
                    <p className='sub--text-sub'>Please check your connection and try again. If error persisit, contact us at support@getquicka.com</p>
                </span>
            </div>

            <div className="sub--mini">
                {width <= 450 && <BsPatchExclamation style={{ fontSize: '2.4rem' }} />}
                <button onClick={handleRefreshAll} className='sub--btn'>Try again</button>
            </div>
        </div>
    )
}