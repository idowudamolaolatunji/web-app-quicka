import React from 'react'
import { useNavigate } from 'react-router-dom';
import DefaultButton from './DefaultButton';
import { MdKeyboardBackspace } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';

function BackButton({ to=-1, close, iconType="back" }) {
    const navigate = useNavigate();

    // I NEED YOU TO REMEMBER WHAT'S GOING ON HERE...
    // iconType = close or back

    return (
        <DefaultButton>
            <div className='page__section-back' onClick={() => !close ? navigate(to) : close()} >
                {iconType == "back" ? <MdKeyboardBackspace /> : <AiOutlineClose />}
            </div>
        </DefaultButton>
    )
}

export default BackButton