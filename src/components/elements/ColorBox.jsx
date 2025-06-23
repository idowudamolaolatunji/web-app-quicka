import React from "react"

export function ColorBox({ color, handleSelected, selected }) {
    return (
        <div className={`color-box ${selected === color ? 'selected' : ''}`} onClick={() => handleSelected(color)}>
            <span style={{ backgroundColor: `${color}` }}>&nbsp;</span>
        </div>
    )
}

export function ColorBoxPreview({ color }) {
    return (
        <div className={`color-box preview`}>
            <span style={{ backgroundColor: `${color}` }}>&nbsp;</span>
        </div>
    )
}