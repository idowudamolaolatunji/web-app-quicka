import React, { useEffect } from 'react'
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';

import Line from '../../components/Line';
import HomeTop from './homeComponents/HomeTop';
import GetStarted from './homeComponents/GetStarted';
import HomeProgressGrid from './homeComponents/HomeProgressGrid';
import HomeLayoutGrid from './homeComponents/HomeLayoutGrid';
import Spinner from "../../components/spinner/spinner_two"
import './style.css';


function index() {
    const { width } = useWindowSize();
    const { user } = useAuthContext();
    const { loader } = useFetchedContext();
    
    const { storeBasicSetup, storeFinalSetup } = user;
    const userStoreIsSetup = (storeBasicSetup && storeFinalSetup);

    useEffect(function() {
        window.scrollTo(0, 0)
    }, [])

    return (
        <section className='home--section'>
            <HomeTop />

            {userStoreIsSetup ? (
                <>
                    {loader?.order && <Spinner />}s
                    <Line border={1.4} />
                    {width > 500 && <HomeProgressGrid />}
                    <HomeLayoutGrid />
                </>
            ) : (
                <>
                    <Line border={1.4} />
                    <GetStarted />
                </>
            )}
        </section>
    )
}

export default index;