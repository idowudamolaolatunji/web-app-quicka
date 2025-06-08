import React from 'react'
import { JellyTriangle } from 'ldrs/react'
import 'ldrs/react/JellyTriangle.css'


export default function Switching() {
    return (
        <div className="spinner_container" role="presentation">
            <JellyTriangle
                size="30"
                speed="1.75"
                color="#ff7a49"
            />
            <p className='spinner_text'>Switching...</p>
        </div>
    )
}
