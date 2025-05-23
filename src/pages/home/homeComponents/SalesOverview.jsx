import React, { useState } from 'react'
import SalesOverviewChart from './SalesOverviewChart'
import SelectAutoWidthDropdown from '../../../components/form/SelectAutoWidthDropdown'
import { useFetchedContext } from '../../../context/FetchedContext';
import ErrorComponent from '../../../components/layout/ErrorComponent';

const datePeriods = [
    { title: 'This Year', value: 'this-year' },
    { title: 'Last Year', value: 'last-year' },
]

function SalesOverview() {
    const [period, setPeriod] = useState("this-year");
    
    const { orders, error } = useFetchedContext();
    const isOrders = orders && orders?.length > 0;
    const isError = error?.order;
    
    return (
        <div className='card sales-section'>
            <span className='section--top'>
                <div className="section--heading">
                    <h2>Your Business Yearly Sales Perfomance</h2>
                    <p>View your sales performance through a well detailed & accurate chart.</p>
                </div>

                <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setPeriod}  />
            </span>

            {isError ? (
                <ErrorComponent text={error?.order} customStyle={{ paddingTop: "6rem" }} />
            ) : (
                <SalesOverviewChart period={period} />
            )}
            
        </div>
    )
}

export default SalesOverview