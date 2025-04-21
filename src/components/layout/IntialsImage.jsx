import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/helper';

function IntialsImage({ type="user", store }) {
    const { user } = useAuthContext();

    return (
        <React.Fragment>
            {type == "user" ? (
                user?.image?.url ? (
                    <img className='item--user-img' src={user?.image?.url} alt={user?.firstname} />
                ) : (
                    <span className='item--user-img'>{getInitials(user?.firstname, user?.lastname)}</span>
                )
            ) : (
                store?.storeLogo?.url ? (
                    <img className='item--user-img' src={store?.storeLogo?.url} alt={store?.name} />
                ) : (
                    <span className='item--user-img'>{getInitials(store?.name?.split(" ")[0], store?.name?.split(" ")[1] || "")}</span>
                )
            )}
        </React.Fragment>
    )
}

export default IntialsImage