import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

function CheckBoxInput({ setIsChecked, isChecked }) {
// function CheckBoxInput() {
    // const [isChecked, setIsChecked] = useState(false);
    return (
        <div id="checkbox" className={isChecked ? 'is-selected' : ''} onClick={() => setIsChecked(!isChecked)}>
            {isChecked && <FaCheck />}
        </div>
    )
}

export default CheckBoxInput