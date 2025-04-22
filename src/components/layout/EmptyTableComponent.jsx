import React from 'react'
import { useNavigate } from 'react-router-dom'

function EmptyTableComponent({ name, img, title, text, className, btns, customStyle, btnForAction }) {
    const navigate = useNavigate();
    const isSideLink = name == "collection" || name == "group";

    return (
        <div className={className} style={customStyle}>
            <div className="empty--img">
                <img src={img} alt="empty image" />
            </div>
            <div className='empty--info'>
                <h3 className='heading'>{title}</h3>
                <p className='text no-hyphens'>{text}</p>
                <span className='empty--btns'>
                    {btns?.map((btn, index) => (
                        <button key={index} onClick={() => isSideLink ? btnForAction() : navigate(btn.link)}>
                            {btn.title}
                        </button>
                    ))}
                </span>
            </div>
        </div>
    )
}

export default EmptyTableComponent