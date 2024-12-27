import React from "react"

function ColorBox({ color, handleSelected, selected }) {
    return (
        <div className={`color-box ${selected === color ? 'selected' : ''}`} onClick={() => handleSelected(color)}>
            <span style={{ backgroundColor: `${color}` }}>&nbsp;</span>
        </div>
    )
}

export default ColorBox