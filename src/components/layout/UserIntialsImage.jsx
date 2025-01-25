import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/helper';

function UserIntialsImage() {
    const { user } = useAuthContext();

    return (
        <>
            {user?.image?.url ? (
                <img className='item--user-img' src={user?.image?.url} alt={user?.firstname} />
            ) : (
                <span className='item--user-img'>{getInitials(user?.firstname, user?.lastname)}</span>
            )}
        </>
    )
}

export default UserIntialsImage