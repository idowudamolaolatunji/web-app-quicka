
import React, { useEffect } from 'react'
import { useFetchedContext } from '../../context/FetchedContext'
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { formatDateNotify } from '../../utils/helper';
import { useAuthContext } from '../../context/AuthContext';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function Notification({ setIndicator, close }) {
    const navigate = useNavigate();
    const { headers, store } = useAuthContext();
    const { notifications, error, loader, handleFetchMyStoreNotifications } = useFetchedContext();

    const handleUnshowIndicator = function() {
        setIndicator(false);
    }

    async function handleReadNotification(id) {
        await fetch(`${BASE_API_URL}/notifications/read/${id}?slug=${store?.slug}`, { method: "PATCH", headers });
        await handleFetchMyStoreNotifications();
        handleUnshowIndicator();
    }

    useEffect(function() {
        handleUnshowIndicator();
    }, []);

    
    return (
        <div className='notification--container'>
            <div className="top">

            </div>

            <div className="">
                {(loader?.notification && !error?.notification && notifications?.length < 1) && (
                    <p>Loading...</p>
                )}

                {(error?.notification && !loader?.notification && notifications?.length < 1) && (
                    <p>error...</p>
                )}

                {(notifications?.length > 0 && !loader?.notification && !error?.notification) && (
                    <div className="notifications">
                        {notifications?.map(notification => (
                            <div className='notification--figure'
                                onClick={() => {
                                    if(notification?.status == "unread") {
                                        handleReadNotification(notification?._id);
                                    }
                                    navigate(notification?.nofity_to);
                                    close();
                                }}
                            >
                                <div className='flex-align-center'>
                                    <span className='figure--date'>{formatDateNotify(notification?.date)}</span>
                                    {notification?.status == "unread" && <span className='figure--status'></span>}
                                </div>

                                <div className='flex-align-center' style={{ marginTop: ".4rem", gap: "1rem" }}>
                                    <span className='figure--icon'>{notification?.type == "order" ? <HiOutlineShoppingCart /> : ""}</span>
                                    <p className='figure--title'>{notification?.title}</p>
                                </div>
                                <p className='figure--text'>{notification?.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
