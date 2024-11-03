import React, { Fragment, useEffect } from 'react'
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../context/AuthContext';
import { useDataContext } from '../context/DataContext';
import { useFetchedContext } from '../context/FetchedContext';

import CopyrightText from '../components/CopyrightText';
import DashboardMenu from './uiComponents/DashboardMenu';
import DashboardHead from './uiComponents/DashboardHead';
import NoInternetConnection from '../components/NoInternetConnection';

import './dashboard.css';

function DashboardBase({ children }) {
    const { width } = useWindowSize();
    const { user } = useAuthContext() ;
    const { isMenuCollapsed } = useDataContext();
    const { globalInternetError } = useFetchedContext();

    useEffect(function() {
        document.title = `Quicka | ${user?.firstname}'s store dashboard ✨`
        window.scrollTo(0, 0);
    }, [])

    return (
        <Fragment>
            <DashboardHead />

            <section className={`dashboard--base ${(isMenuCollapsed && width > 900) ? 'collapsed' : ''}`}>
                <DashboardMenu />

                <section className='content--block'>
                    {globalInternetError && <NoInternetConnection /> }

                    {children}

                    <CopyrightText />
                </section>
            </section>
        </Fragment>
    )
}

export default DashboardBase