import React from 'react'

function SearchInput({ value, setValue, placeholder }) {
  return (
    <input type="search" value={value} onChange={e => setValue(e.target.value)} className="table--input form--input" placeholder={placeholder || 'Search..'} />
  )
}

export default SearchInput