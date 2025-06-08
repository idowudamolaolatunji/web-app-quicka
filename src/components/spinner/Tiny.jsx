import React from 'react'
import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'


export default function Tiny() {
    return (
        <Ring
            size="13.5"
            stroke="1.25"
            bgOpacity="0"
            speed="2"
            color="#aaa"
        />
    )
}