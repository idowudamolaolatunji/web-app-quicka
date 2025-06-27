
import React, { useEffect } from 'react'
import { useFetchedContext } from '../../context/FetchedContext'
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { formatDateNotify } from '../../utils/helper';
import { useAuthContext } from '../../context/AuthContext';
import { useLocalStorage } from 'react-use';
import empty_notification from "../../assets/images/dummy_items/no_notification.png";
import Skeleton from 'react-loading-skeleton';
import ErrorComponent from '../layout/ErrorComponent';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function Notification({ setIndicator, close }) {
    const navigate = useNavigate();
    const { headers, store } = useAuthContext();
    const { notifications, error, loader, handleFetchMyStoreNotifications } = useFetchedContext();
    const [_, setIndicatorAmount] = useLocalStorage("indicator", 0);

    const handleUnshowIndicator = function() {
        setIndicator(false);
    }

    async function handleReadNotification(id) {
        await fetch(`${BASE_API_URL}/notifications/read/${id}?slug=${store?.slug}`, { method: "PATCH", headers });
        // SET THE INDICATOR AMOUNT AND REFETCH THE NOTIFICATIONS
        setIndicatorAmount(notifications?.filter(n => n?.status == "unread")?.length - 1)
        await handleFetchMyStoreNotifications();
    }

    useEffect(function() {
        handleUnshowIndicator();
    }, []);

    
    return (
        <div className='notification--container'>
            <div className="top">

            </div>

            <div className="">
                {(loader?.notification && !error?.notification && !notifications) && (
                    <div className="notifications">
                        <div className="notification--figure" style={{ gap: "2rem" }}>
                            {Array(3).fill().map((_, i) => (
                                <div className="flex-column" style={{ gap: ".24rem" }}>
                                    <Skeleton width={150} height={10} />
                                    <div className="flex-align-center">
                                        <Skeleton width={30} height={25} />
                                        <Skeleton width={300} height={10} />
                                    </div>
                                    <Skeleton width="100%" height={10} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(error?.notification && !loader?.notification && notifications?.length < 1) && (
                    <div className="notifications">
                        <ErrorComponent text={error?.notification || "Oops, Error!"} />
                    </div>
                )}

                {(!notifications && !loader?.notification && !error?.notification) && (
                    <div className="notifications" style={{ alignItems: "center" }}>
                        <img src={empty_notification} alt='empty' className='empty--notification' />
                        <p>No notification yet</p>
                    </div>
                )}

                {(notifications?.length > 0 && !loader?.notification && !error?.notification) && (
                    <div className="notifications">
                        {notifications?.map(notification => (
                            <div className={`notification--figure ${notification?.status == "read" ? "read" : ""}`}
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
