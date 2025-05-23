import React, { Fragment, useEffect } from 'react'
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import CopyrightText from '../../components/elements/CopyrightText';
import DashboardMenu from './uiComponents/DashboardMenu';
import DashboardHead from './uiComponents/DashboardHead';
import './dashboard.css';
import OnboardingFloater from '../../components/elements/OnboardingFloater';
import { useLocation } from 'react-router-dom';
import TooManyRequestError from '../../components/layout/TooManyRequestError';
import GeneralFetchError from '../../components/layout/GeneralFetchError';
import InternetConnectionError from '../../components/layout/InternetConnectionError';
import { useFetchedContext } from '../../context/FetchedContext';
import { useCheckInternetConnection } from '../../hooks/useCheckInternetConnection';


function DashboardBase({ children }) {
    const { width } = useWindowSize();
    const { pathname } = useLocation();
    const { user, store } = useAuthContext() ;
    const { isMenuCollapsed } = useDataContext();
    const { rateExceeded, internetError, generalError } = useFetchedContext();
    
    const internetStatus = useCheckInternetConnection();
    const showOnboardFloater = (
        !store?.storeOnboardCompleted &&
        pathname != "/" && pathname != "/dashboard"&&
        pathname != "/dashboard/"
    );

    useEffect(function() {
        document.title = `Quicka | ${user?.firstname}'s store dashboard ✨`
        window.scrollTo(0, 0);
    }, []);

    return (
        <Fragment>
            <DashboardHead />

            <section className={`dashboard--base ${(isMenuCollapsed && width > 900) ? 'collapsed' : ''}`}>
                <DashboardMenu />

                <section className='content--block' style={width <= 600 ? { paddingBottom: "8rem"} : {}}>
                    {rateExceeded && <TooManyRequestError />}
                    {(internetStatus == "offline" || internetError) && <InternetConnectionError />}
                    {generalError && <GeneralFetchError />}

                    {children}
                    
                    {width > 600 && <CopyrightText />}
                    {showOnboardFloater && <OnboardingFloater /> }
                </section>

                {width <= 600 && <CopyrightText />}
            </section>
        </Fragment>
    )
}

export default DashboardBase