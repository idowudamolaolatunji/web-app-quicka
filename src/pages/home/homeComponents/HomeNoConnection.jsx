import React from 'react'
import { MdSignalWifiConnectedNoInternet0 } from 'react-icons/md'
import { useFetchedContext } from '../../../context/FetchedContext'
import { useWindowSize } from 'react-use'

function HomeNoConnection() {
    const { width } = useWindowSize();

    const { handleGlobalRefetch } = useFetchedContext()

    const handleRefreshAll = function () {
        handleGlobalRefetch();
    }

    return (
        <div className="home--sub error">
            <div className="sub--mini">
                <MdSignalWifiConnectedNoInternet0 style={{ fontSize: '2.4rem' }} />
                <p className='sub--text'>
                    Oops! No Internet Connection!!
                    <p className='sub--text-sub'>Please check your internect connection and try again</p>
                </p>
            </div>

            <div className="sub--mini">
                {width <= 450 && <MdSignalWifiConnectedNoInternet0 style={{ fontSize: '2.4rem' }} />}
                <button onClick={handleRefreshAll} className='sub--btn'>Try again</button>
            </div>
        </div>
    )
}

export default HomeNoConnection