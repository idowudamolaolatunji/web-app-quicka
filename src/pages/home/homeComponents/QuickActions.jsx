import React from 'react'
import { LuTags } from 'react-icons/lu'
import { MdOutlineHelpOutline, MdOutlinePayment, MdOutlineShoppingBag } from 'react-icons/md'
import DefaultButton from '../../../components/button/DefaultButton'
import { openWidget } from '../../../utils/helper'
import { useNavigate } from 'react-router-dom'


function QuickButton({ icon, text, action }) {
    return (
        <DefaultButton customStyle={{ width: '100%', padding: 0 }}>
            <div className='quick-btn' onClick={action}>
                {icon} {text}
            </div>
        </DefaultButton>
    );
}

function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className='card quick-section'>
            <div className="section--heading" >
                <h2>Quick Actions</h2>
            </div>

            <div className="quick-container">
                <QuickButton icon={<MdOutlineShoppingBag />} text='Record a sale' action={() => navigate('/dashboard/orders/record')} />
                <QuickButton icon={<LuTags />} text='Add product' action={() => navigate('/dashboard/products/upload')} />
                <QuickButton icon={<MdOutlineHelpOutline />} text='Help Center' action={openWidget} />
            </div>
        </div>
    )
}

export default QuickActions