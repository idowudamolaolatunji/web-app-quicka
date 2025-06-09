import React from 'react'


export default function RadioInput({ active=false }) {
  return (
    <span className={`radio--input ${active ? "active" : ""}`}>&nbsp;</span>
  )
}
