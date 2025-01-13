import React from 'react'

import { ring } from 'ldrs'

ring.register()

function index() {
  return (
    <l-ring
        size="12.5"
        stroke="1.25"
        bg-opacity="0"
        speed="2" 
        color="#aaa" 
    ></l-ring>
  )
}

export default index