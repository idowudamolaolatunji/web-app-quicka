import React, { useState } from 'react'
import HomeProgressGrid from './HomeProgressGrid';
import SelectAutoWidthDropdown from '../../../components/form/SelectAutoWidthDropdown';
import InsightGrid from './InsightGrid';
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../../context/AuthContext';
import { useDataContext } from '../../../context/DataContext';

const datePeriods = [
    { value: 'today', title: 'Today' },
    { value: 'this-week', title: 'This Week' },
    { value: 'this-month', title: 'This Month' },
    { value: 'this-year', title: 'This Year' },
]

function HomeInsightContainer() {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    /////////////////////////////////////////
    /////////////////////////////////////////
    const { homeInsightPeriod, setHomeInsightPeriod } = useDataContext();
    const period = homeInsightPeriod;
    

    return (
        <div className={`insight--container ${width > 500 ? 'card' : ''}`}>
            <div className="section--top">
                <div className="section--heading" style={ width < 450 ? { width: "100%"} : {}}>
                    <span className='flex' style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <h2>Brief Overview</h2>

                        {width <= 450 && <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setHomeInsightPeriod} />}
                    </span>

                    <p>This is what <span>{store?.name}</span> {period == "today" ? "is" : period == "last-week" ? "was" : "has been"} up to {period?.replace("-", " ")}!</p>
                </div>

                {width > 450 && <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setHomeInsightPeriod} />}
            </div>

            {/* THE CARDS THEMSELVES, the periods can no be access from context */}
            <InsightGrid />

            {width <= 500 && <HomeProgressGrid />}
        </div>
    )
}

export default HomeInsightContainer