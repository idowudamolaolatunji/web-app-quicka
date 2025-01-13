import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function FilterElement({ data, handleClose}) {
  return (
    <span className='filter--tab'>
        {data} <AiOutlineClose />
    </span>
  )
}

export default FilterElement