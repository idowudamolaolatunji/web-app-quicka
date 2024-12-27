import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/helper';

function UserIntialsImage() {
    const { user } = useAuthContext();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    return (
        <>
            {user?.image ? (
                <img className='item--user-img' src={`${BASE_URL}/${user.image}`} alt={user.fullname} />
            ) : (
                <span className='item--user-img'>{getInitials(user?.fullname)}</span>
            )}
        </>
    )
}

export default UserIntialsImage