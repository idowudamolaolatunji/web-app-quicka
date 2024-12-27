import React from 'react'

function SearchInput({ value, setValue }) {
  return (
    <input type="search" value={value} onChange={e => setValue(e.target.value)} className="table--input form--input" placeholder='search..' />
  )
}

export default SearchInput