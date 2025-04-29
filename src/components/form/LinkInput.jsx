import React from 'react'

function LinkInput({ url=".quicka.store", name, placeholder, value, handleChange, linkPosition, readOnly, type = "text" }) {
    return (
        <div className={`form--input-box ${linkPosition == "start" ? "start" : ""}`}>
            <input
                type={type} id={name}
                className={`form--input ${name == "whatsapp" ? "value" : ""}`}
                placeholder={placeholder} name={name} value={value}
                onChange={handleChange} readOnly={readOnly}
            />
            <span className='url--box'>{url}</span>
        </div>
    )
}

export default LinkInput