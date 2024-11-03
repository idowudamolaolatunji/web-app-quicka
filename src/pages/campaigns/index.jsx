import React from 'react'
import { BiChevronDown } from 'react-icons/bi'

function index() {
  return (
    <div className='page__section--heading'>
      <h2 className="page__section--title">campaigns</h2>
      <button className="page__section-top-btn">More Actions <BiChevronDown /></button>
    </div>
  )
}

export default index