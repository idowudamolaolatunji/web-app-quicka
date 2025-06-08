import React from 'react';
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

export default function MainSpinner() {

    return (
        <div className="spinner_container" role="presentation">
            <Bouncy
                size="50"
                speed="1.75"
                color="#ff7a49"
            />
        </div>
    )
}