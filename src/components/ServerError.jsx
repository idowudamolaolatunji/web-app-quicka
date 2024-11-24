import React from 'react'
import { useFetchedContext } from '../context/FetchedContext'
import { useWindowSize } from 'react-use'
import { LuDatabaseBackup } from 'react-icons/lu';

function ServerError() {
    const { width } = useWindowSize();
    const { handleGlobalRefetch } = useFetchedContext()

    const handleRefreshAll = function () {
        handleGlobalRefetch();
    }

    return (
        <div className="top--bar error">
            <div className="sub--mini">
                <LuDatabaseBackup style={{ fontSize: '2.4rem' }} />
                <p className='sub--text'>
                    Oops! Server is Busy!!
                    <p className='sub--text-sub'>Please try again later. If error persisit, contact us at support@getquicka.com</p>
                </p>
            </div>

            <div className="sub--mini">
                {width <= 450 && <LuDatabaseBackup  style={{ fontSize: '2.4rem' }} />}
                <button onClick={handleRefreshAll} className='sub--btn'>Try again</button>
            </div>
        </div>
    )
}

export default ServerError