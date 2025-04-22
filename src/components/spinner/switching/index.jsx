import React from 'react'
import "./style.css";

export default function index() {
  return (
    <div className="spinner--container" role="presentation">
        <div class="spinner_switch">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <p className='spinner_text'>Switching...</p>
    </div>
  )
}
