import React from 'react'
import { ring } from 'ldrs'
ring.register()


export default function index() {
  return (
    <l-ring
        size="13.5"
        stroke="1.25"
        bg-opacity="0"
        speed="2" 
        color="#aaa" 
    ></l-ring>
  )
}