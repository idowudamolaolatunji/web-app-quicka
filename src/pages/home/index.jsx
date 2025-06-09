import React, { useEffect } from 'react'
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Line from '../../components/elements/Line';
import HomeTop from './homeComponents/HomeTop';
import GetStarted from './homeComponents/GetStarted';
import Spinner from "../../components/spinner/MainSpinner"
import HomeLayoutGrid from './homeComponents/HomeLayoutGrid';
import HomeProgressGrid from './homeComponents/HomeProgressGrid';
import ConnectionError from '../../components/layout/GeneralFetchError';
import './style.css';


function index() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { loader } = useFetchedContext();
    const { name, storeOnboardCompleted } = store;
    const STEPS_PROGRESS = import.meta.env.VITE_ONBOARD_STEPS_PROGRESS_KEY;
    const progressStored = localStorage.getItem(STEPS_PROGRESS);

    
    useEffect(function () {
        document.title = `Quicka - Welcome back ${name} | Business Management Tool for SME's`
        window.scrollTo(0, 0);

        if(storeOnboardCompleted && progressStored) {
            localStorage.removeItem(STEPS_PROGRESS)
        }
    }, []);


    return (
        <section className='home--section'>
            <HomeTop />
            <Line border={1.4} />

            {storeOnboardCompleted ? (
                <React.Fragment>
                    {(loader?.order) && <Spinner />}
                    {(width > 500) && <HomeProgressGrid />}
                    <HomeLayoutGrid />
                </React.Fragment>
            ) : (
                <GetStarted />
            )}
        </section>
    )
}

export default index;