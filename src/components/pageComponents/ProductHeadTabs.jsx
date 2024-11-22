import React from 'react'
import { MdOutlineFilterList, MdOutlineRefresh, MdTableRows } from 'react-icons/md'
import TooltipUI from '../TooltipUI'
import { BsFillGrid3X3GapFill, BsFillGridFill, BsTable } from 'react-icons/bs'
import SearchInput from '../SearchInput'
import { useWindowSize } from 'react-use'
import { useDataContext } from '../../context/DataContext'

function ProductHeadTabs({ value, setValue, handleFetch }) {
    const { width } = useWindowSize()
    const { activeDisplayTab, handleDisplayTab } = useDataContext();

    return (
        <div className='content'>
            <span className='flex'>
                <TooltipUI placement='top' title="Refresh table">
                    <button className='table--btn' onClick={handleFetch}><MdOutlineRefresh /></button>
                </TooltipUI>

                <SearchInput value={value} setValue={setValue} />
            </span>


            <span className="flex">
                <button className='table--btn'>Clear filter</button>

                <TooltipUI placement='top' title="Filters">
                    <button className='table--btn'><MdOutlineFilterList /></button>
                </TooltipUI>

                <span className='table--tabs'>
                    <TooltipUI placement='top' title="Table View">
                        <span className={activeDisplayTab == "table" ? "active" : ""} onClick={() => handleDisplayTab("table")}><BsTable /> </span>
                    </TooltipUI>


                    <TooltipUI placement='top' title="Grid View">
                        <span className={activeDisplayTab == "grid" ? "active" : ""} onClick={() => handleDisplayTab("grid")}>{width < 365 ? <MdTableRows /> : width <= 620 ? <BsFillGridFill /> : <BsFillGrid3X3GapFill />} </span>
                    </TooltipUI>
                </span>
            </span>
        </div>
    )
}

export default ProductHeadTabs