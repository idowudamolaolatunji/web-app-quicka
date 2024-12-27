import React, { useState } from 'react'
import TopSalesChannelsChart from './TopSalesChannelsChart'
import { useNavigate } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import ErrorComponent from '../../../components/layout/ErrorComponent';




function TopSalesChannels() {
    const navigate = useNavigate();
    const { orders, error } = useFetchedContext()

    const isOrders = orders && orders?.length > 0;
    const isError = error?.order;

    return (
        <div className='card sales-channel-section'>
            <div className="section--top">
                <div className="section--heading">
                    <h2>Top five sales channels</h2>
                    <p>Your top five most profitting sales channel.</p>
                </div>
            </div>

            {(!isOrders && isError) && <ErrorComponent text={error?.order} />}

            {(orders && !isError) && (
                <>
                    {isOrders && <TopSalesChannelsChart />}
                    {!isOrders && (
                        <div className="no--channel">
                            <button onClick={() => navigate('/dashboard/orders/record')}>Record new sales</button>
                            <p className="">There's no sales data yet!</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default TopSalesChannels