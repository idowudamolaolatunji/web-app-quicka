import React from 'react'
import { AiFillInfoCircle } from 'react-icons/ai'

function Info({ text, type = "text", children }) {
    return (
        <span className='info--item' style={type == "html" ? { alignItems: "flex-start", gap: ".68rem" } : {}}>
            <AiFillInfoCircle />
            {type == "text" ? (
                <p>{text}</p>
            ) : (
                <div>{children}</div>
            )}
        </span>
    )
}

export default Info