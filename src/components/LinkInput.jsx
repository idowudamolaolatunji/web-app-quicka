import React from 'react'

function LinkInput({ url=".quicka.store", name, placeholder, value, handleChange, linkPosition }) {
  return (
    <div className={`form--input-box ${linkPosition == "start" ? "start" : ""}`}>
        <input type="text" id={name} className="form--input" placeholder={placeholder} name={name} value={value} onChange={handleChange} />
        <span className='url--box'>{url}</span>
    </div>
  )
}

export default LinkInput