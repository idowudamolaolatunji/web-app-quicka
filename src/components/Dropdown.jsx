import React from 'react'
import { Link } from 'react-router-dom';
import UserIntialsImage from './UserIntialsImage';
import { useAuthContext } from '../context/AuthContext';
import { useOutsideClick } from '../hooks/useOutsideClick';

import { ImDisplay } from 'react-icons/im';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';


function Dropdown({ setIsShown, setLoading, setResponse }) {
    const { user, signoutUser } = useAuthContext();

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
        setLoading(true);
        handleResetResponse()

        const result = await signoutUser();
        setLoading(true);
        if (!result) return setResponse({ status: "error", message: "Error logging out!" })
        setResponse({ status: "success", message: "Logout successful!" });

    }

    return (
        <div className={`dropdown`} ref={ref} onClick={handleCloseByLink}>
            <Link className='dropdown--item' to='/dashboard/profile'>
                <span className='item--user'>
                    <UserIntialsImage />
                    <span className='item--user-info'>
                        <p>{user?.fullname}</p>
                        <p>{user.email}</p>
                    </span>
                </span>
            </Link>
            <div className='dropdown--item'><ImDisplay /> Maintenance Status</div>
            <Link className='dropdown--item' to='/dashboard/settings'><IoSettingsOutline /> Settings</Link>
            <div className='dropdown--item' onClick={handleLogout}><IoLogOutOutline /> Logout</div>
        </div>
    )
}

export default Dropdown