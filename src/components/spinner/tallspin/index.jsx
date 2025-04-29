import React from 'react'
import { tailspin } from 'ldrs'
tailspin.register()

export default function index() {
    return (
        <l-tailspin
            size="24"
            stroke="3"
            speed="0.9"
            color="#fff"
        ></l-tailspin>
    )
}