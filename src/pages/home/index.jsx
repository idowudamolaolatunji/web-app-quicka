import React, { useEffect } from 'react'
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import Line from '../../components/elements/Line';
import HomeTop from './homeComponents/HomeTop';
import GetStarted from './homeComponents/GetStarted';
import Spinner from "../../components/spinner/mainSpinner"
import HomeLayoutGrid from './homeComponents/HomeLayoutGrid';
import HomeProgressGrid from './homeComponents/HomeProgressGrid';
import ConnectionError from '../../components/layout/ConnectionError';
import './style.css';


function index() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { loader, globalConnectionError } = useFetchedContext();
    const { name, storeOnboardCompleted } = store;
    const STEPS_PROGRESS = import.meta.env.VITE_ONBOARD_STEPS_PROGRESS_KEY;
    const progressStored = localStorage.getItem(STEPS_PROGRESS);

    
    useEffect(function () {
        document.title = `Quicka | Welcome back ${name}`
        window.scrollTo(0, 0);

        if(storeOnboardCompleted && progressStored) {
            localStorage.removeItem(STEPS_PROGRESS)
        }
    }, []);


    return (
        <React.Fragment>
            {globalConnectionError && <ConnectionError />}

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
        </React.Fragment>
    )
}

export default index;