import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserIntialsImage from './UserIntialsImage';
import { useAuthContext } from '../../context/AuthContext';
import { useOutsideClick } from '../../hooks/useOutsideClick';

import { ImDisplay } from 'react-icons/im';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../context/FetchedContext';
import { SlReload } from 'react-icons/sl';


function Dropdown({ setIsShown, setLoading, setResponse }) {
    const { width } = useWindowSize();
    const { pathname } = useLocation();
    const { handleGlobalRefetch } = useFetchedContext();
    const { user, signoutUser, store } = useAuthContext();

    const ref = useOutsideClick(handleClose);

    function handleClose () {
        setIsShown(false);
    }

    const handleResetResponse = function () {
        setResponse({ status: '', message: '' });
    }

    const handleCloseByLink = function(e) {
        if (e.target.closest('.dropdown--item').tagName === 'A') {
            handleClose();
        };
    }

    async function handleLogout() {
        // LOGOUT LOGIC
        try {
            setLoading(true);
            handleResetResponse()
    
            const result = await signoutUser();
            if (!result) throw new Error();
            setResponse({ status: "success", message: "Logout successful!" });
        } catch(_) {
            setResponse({ status: "error", message: "Error logging out!" })
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={"dropdown"} ref={ref} onClick={handleCloseByLink}>
            <Link className={`dropdown--item ${pathname.includes("/profile") ? "is-active" : ""}`} to='/dashboard/profile'>
                <span className='item--user'>
                    <UserIntialsImage />
                    <span className='item--user-info'>
                        <p>{user?.firstname} {user?.lastname}</p>
                        <p>{user.email}</p>
                    </span>
                </span>
            </Link>
            <div className="dropdown--item"><ImDisplay />Maintain Site</div>
            <Link className={`dropdown--item ${pathname.includes("/settings") ? "is-active" : ""}`} to="/dashboard/settings"><IoSettingsOutline /> Settings</Link>

            {(width < 600 && store?.storeOnboardCompleted) && (
                <div className="dropdown--item" onClick={handleGlobalRefetch}><SlReload />Reload app</div>
            )}
            <div className="dropdown--item" onClick={handleLogout}><IoLogOutOutline /> Logout</div>
        </div>
    )
}

export default Dropdown