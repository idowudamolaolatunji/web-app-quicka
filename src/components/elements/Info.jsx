import React from 'react'
import { AiFillInfoCircle } from 'react-icons/ai'

function Info({ text }) {
  return (
    <span className='info--item'>
        <AiFillInfoCircle />
        <p>{text}</p>
    </span>
  )
}

export default Info