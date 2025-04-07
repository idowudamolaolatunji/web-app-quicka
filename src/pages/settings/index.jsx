import React, { useEffect } from 'react'
import { useFetchedContext } from '../../context/FetchedContext';
import ConnectionError from '../../components/layout/ConnectionError';

function index() {
    const { globalConnectionError } = useFetchedContext();

    useEffect(function() {
        document.title = "Quicka | Buy domain";
        window.scrollTo(0, 0);
    }, [])

    return (
        <React.Fragment>
            {globalConnectionError && <ConnectionError />}

            <div className='page__section--heading'>
                <h2 className="page__section--title">Settings</h2>
            </div>
        </React.Fragment>
    )
}

export default index