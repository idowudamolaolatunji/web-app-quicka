import React from 'react'
import { IoSend } from 'react-icons/io5'
import { useWindowSize } from 'react-use'
import { cap1stLetter } from '../../../utils/helper';

function Welcome({ firstname, setClose }) {
    const { width } = useWindowSize();

    return (
        <div className='welcome--container'>
            <h2 className='welcome--heading'>
                Hi, {cap1stLetter(firstname)}. {(width <= 450) && <br />} Welcome to Quicka
            </h2>

            <div className="welcome--video">
                <video controls width="100%" height={width <= 450 ? "100%" : "330"} autoPlay>
                    <source src='https://res.cloudinary.com/du8iw1efa/video/upload/v1736758182/original-60dad17677eecdfdb5bc2a979f141c23_dkemi9_ar05cv.mp4' />
                </video>
            </div>

            <p className='welcome--text'>Finalize your setup in a few steps to get your store up & running, and make your website visible to the world.</p>

            <button className="general--btn" style={{ fontWeight: "600" }} onClick={setClose}>
                Let's Go <IoSend />
            </button>
        </div>
    )
}

export default Welcome;