import React from 'react'
import { MdOutlineRefresh } from 'react-icons/md'
import TooltipUI from '../../../components/TooltipUI'
import SearchInput from '../../../components/SearchInput'

function CollectionHeadTabs({ value, setValue, handleFetch }) {
  return (
    <div className='content'>
            <span className='flex'>
                <TooltipUI placement='top' title="Refresh table">
                    <button className='table--btn' onClick={handleFetch}><MdOutlineRefresh /></button>
                </TooltipUI>

                <SearchInput value={value} setValue={setValue} />
            </span>
        </div>
  )
}

export default CollectionHeadTabs