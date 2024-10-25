import React, { Fragment, useEffect, useState } from 'react'
import DashboardHead from './uiComponents/DashboardHead';
import DashboardMenu from './uiComponents/DashboardMenu';
import './dashboard.css';
import { useDataContext } from '../context/DataContext';

import { useWindowSize } from 'react-use';
import { useAuthContext } from '../context/AuthContext';

function DashboardBase({ children }) {
    const { width } = useWindowSize();
    const { user, store } = useAuthContext() ;
    const { isMenuCollapsed } = useDataContext();


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
                    {children}

                    <p className='copyright--text'>&copy; Quicka Inc <img src="../../favicon.png" /> 2024, All right reserved.</p>
                </section>
            </section>
        </Fragment>
    )
}

export default DashboardBase