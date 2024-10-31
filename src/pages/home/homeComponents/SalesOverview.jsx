import React, { useState } from 'react'
import SalesOverviewChart from './SalesOverviewChart'
import SelectAutoWidthDropdown from '../../../components/SelectAutoWidthDropdown'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'


const datePeriods = [
    { title: 'This Year', value: 'this-year' },
    { title: 'Last Year', value: 'last-year' },
]

function SalesOverview() {
    const [isHorizontal, setIsHorizontal] = useState(false);
    const [period, setPeriod] = useState("")

    const handleChangeView = function() {
        setIsHorizontal(!isHorizontal)
    }

    return (
        <div className='card sales-section'>
            <span className='section--top'>
                <div className="section--heading">
                    <h2>Your Business Yearly Sales Perfomance</h2>
                    <p>View your sales performance through a well detailed & accurate chart.</p>
                </div>

                <div className='flex'>
                    <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setPeriod}  />

                    {/* <span className='rotate--icon' onClick={handleChangeView}>
                        { isHorizontal ? <AiOutlineRotateLeft  /> : <AiOutlineRotateRight  /> }
                    </span> */}
                </div>
            </span>


            <SalesOverviewChart {...isHorizontal} />
        </div>
    )
}

export default SalesOverview