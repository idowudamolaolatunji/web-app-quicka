import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import CustomAlert from './CustomAlert';
import Spinner from './spinner/spinner_two'
import UserIntialsImage from './UserIntialsImage';
import { useAuthContext } from '../context/AuthContext';
import { useOutsideClick } from '../hooks/useOutsideClick';

import { ImDisplay } from 'react-icons/im';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { createPortal } from 'react-dom';


function Dropdown({ setIsShown }) {
    const { user, signoutUser } = useAuthContext();
    
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: "", message: "" });
    const ref = useOutsideClick(handleClose);
    
    function handleClose() {
        if(loading) return;
        setIsShown(false);
    }

    function handleCloseByLink(e) {
        if(e.target.closest('.dropdown--item').tagName === 'A') {
            setIsShown(false);
        };
    }

    async function handleLogout() {
        // LOGOUT LOGIC
        setLoading(true);
        
        const result = await signoutUser();
        setLoading(true);
        if(!result) return setResponse({ status: "error", message: "Error logging out!" })
        setResponse({ status: "success", message: "Logout successful!" });
        
    }

    return (
        <>
            {loading && <Spinner />}
            {(response.status || response.message) && <CustomAlert type={response.status} message={response.message} />}


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
        </>
    )
}

export default Dropdown