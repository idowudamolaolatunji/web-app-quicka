import React from 'react'

function Tab({ title, value, onClick, active }) {
  return (
    <button className={`page--tab ${active ? "active" : ""}`} onClick={onClick}>
        {title} {value && <span className='value' style={{ fontSize: "1.2rem"}}>({value})</span>}
    </button>
  )
}

export default Tab