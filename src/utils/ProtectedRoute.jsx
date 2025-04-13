import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext';
import DashboardBase from '../ui/dashboardUI/DashboardBase';
import { useLocalStorage } from 'react-use';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
const PREV_URL = import.meta.env.VITE_PREV_URL_KEY


function ProtectedRoute() {
    let { user } = useAuthContext();
    let { pathname } = useLocation() 
    const [_, setValue] = useLocalStorage(PREV_URL, "");

    useEffect(function() {
        if(!user && pathname) {
            setValue(pathname)
        }
    }, [pathname, setValue]);


    if (!user) {
        return <Navigate to={`/login`} replace />;
    }

    
    return (
        <DashboardBase>
            <Outlet />
        </DashboardBase>
    );
}

export default ProtectedRoute;