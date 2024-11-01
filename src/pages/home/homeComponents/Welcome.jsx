import React from 'react'

function Welcome({ setClose }) {
  return (
    <div className='welcome--container'>
        <h2 className='welcome--heading'>
            Welcome to Quicka 
            <span className='welcome--emoji'>
                <picture>
                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="48" height="48" />
                </picture>
            </span>
        </h2>

        <p className='welcome--text'>Finalize your setup in a few steps to get your store up & running, and make your website visible to the world.</p>

        <button className="general--btn" onClick={setClose}>Let's Go!</button>
    </div>
  )
}

export default Welcome