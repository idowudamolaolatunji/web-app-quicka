import React, { useEffect } from 'react'
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';

import Line from '../../components/Line';
import HomeTop from './homeComponents/HomeTop';
import GetStarted from './homeComponents/GetStarted';
import Spinner from "../../components/spinner/spinner_two"
import HomeLayoutGrid from './homeComponents/HomeLayoutGrid';
import HomeProgressGrid from './homeComponents/HomeProgressGrid';
import NoInternetConnection from '../../components/NoInternetConnection';
import ServerError from '../../components/ServerError';
import './style.css';


function index() {
    const { width } = useWindowSize();
    const { user } = useAuthContext();
    const { loader, globalInternetError, globalServerError } = useFetchedContext();

    const { storeBasicSetup, storeFinalSetup } = user;
    const userStoreIsSetup = (storeBasicSetup && storeFinalSetup);
    

    useEffect(function () {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            {globalInternetError && <NoInternetConnection />}
            {globalServerError && <ServerError />}

            <section className='home--section'>
                <HomeTop />
                <Line border={1.4} />

                {userStoreIsSetup ? (
                    <>
                        {(loader?.order) && <Spinner />}
                        {(width > 500) && <HomeProgressGrid />}
                        <HomeLayoutGrid />
                    </>
                ) : (
                    <GetStarted />
                )}
            </section>
        </>
    )
}

export default index;