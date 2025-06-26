import React from 'react'
import { MdOutlineFilterList, MdOutlineRefresh, MdTableRows } from 'react-icons/md'
import TooltipUI from '../layout/TooltipUI'
import { BsFillGrid3X3GapFill, BsFillGridFill, BsTable } from 'react-icons/bs'
import { useWindowSize } from 'react-use'
import { useDataContext } from '../../context/DataContext'

export default function TableHeadTabs({ pageName, inputPlaceholder, searchVal, setSearchVal, handleFetch }) {
    const { width } = useWindowSize()
    const { activeDisplayTab, handleDisplayTab, handleToggleFilter } = useDataContext();


    return (
        <div className='content'>
            <span className='flex'>
                <TooltipUI placement='top' title={`Reload ${pageName == "expenses" ? "expenses" : pageName == "delivery" ? "delivery rates" : `${pageName}s`}`}>
                    <button className='table--btn' onClick={handleFetch}><MdOutlineRefresh /></button>
                </TooltipUI>

                <input type="search" value={searchVal} onChange={e => setSearchVal(e.target.value)} className="table--input form--input" placeholder={inputPlaceholder || 'Search..'} />
            </span>

            {(pageName != "collection" && pageName != "group" && pageName != "newsletter" && pageName != "discount" && pageName != "coupon" && pageName != "delivery") && (
                <span className="flex">
                    {/* <button className='table--btn'>Reset filter</button>

                    <TooltipUI placement='top' title="Filters">
                        <button className='table--btn' onClick={() => handleToggleFilter(pageName)}><MdOutlineFilterList /></button>
                    </TooltipUI> */}

                    {pageName == "product" && (
                        <span className='table--tabs'>
                            <TooltipUI placement='top' title="Table View">
                                <span className={activeDisplayTab == "table" ? "active" : ""} onClick={() => handleDisplayTab("table")}><BsTable /> </span>
                            </TooltipUI>

                            <TooltipUI placement='top' title="Grid View">
                                <span className={activeDisplayTab == "grid" ? "active" : ""} onClick={() => handleDisplayTab("grid")}>{width < 365 ? <MdTableRows /> : width <= 620 ? <BsFillGridFill /> : <BsFillGrid3X3GapFill />} </span>
                            </TooltipUI>
                        </span>
                    )}
                </span>
            )}
        </div>
    )
}