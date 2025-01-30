import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

function CheckBoxInput({ setIsChecked, isChecked }) {
    return (
        <div id="checkbox" className={isChecked ? 'is-selected' : ''} onClick={() => setIsChecked(!isChecked)}>
            {isChecked && <FaCheck />}
        </div>
    )
}

export default CheckBoxInput