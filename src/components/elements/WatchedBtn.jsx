import React from 'react'
import { IoPlayCircleOutline } from 'react-icons/io5'

function WatchedBtn({ title = "Watch", action, style }) {
    return (
        <button className="form--add" name="welcome" onClick={action} style={{ ...style, maxWidth: "fit-content" }}>
            <IoPlayCircleOutline />
            <p>{title}</p>
        </button>
    )
}

export default WatchedBtn
