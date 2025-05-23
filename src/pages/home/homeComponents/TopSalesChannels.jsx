import React, { useState } from 'react'
import TopSalesChannelsChart from './TopSalesChannelsChart'
import { useNavigate } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import ErrorComponent from '../../../components/layout/ErrorComponent';
import { useWindowSize } from 'react-use';


function TopSalesChannels() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { orders, error } = useFetchedContext();

    const isOrders = orders && orders?.length > 0;
    const isError = error?.order;

    return (
        <div className='card sales-channel-section'>
            <div className="section--top">
                <div className="section--heading" style={width < 450 ? {  textAlign: "center", width: "100%", justifyContent: "center" } : {}}>
                    <h2>Top five sales channels</h2>
                    <p>Your top five most profitting sales channel.</p>
                </div>
            </div>

            {isError ? (
                <ErrorComponent text={error?.order} />
            ) : (
                <React.Fragment>
                    {isOrders ? (
                        <TopSalesChannelsChart />
                    ) : (
                        <div className="no--channel">
                            <button onClick={() => navigate('/dashboard/orders/record')}>Record new sales</button>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    )
}

export default TopSalesChannels