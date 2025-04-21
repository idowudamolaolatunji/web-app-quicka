import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { TbAlignBoxLeftBottomFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';


export default function OnboardingFloater() {
    const navigate = useNavigate();
    const { store } = useAuthContext();
    const [completed, setCompleted] = useState(20);

    function calculateCompletionPercentage(obj) {
        const fields = Object.values(obj);
        const trueCount = fields.filter(value => value).length;
        const percentage = (trueCount / (fields.length + 1)) * 100;
        return 20 + percentage;
    }

    useEffect(function() {
        setCompleted(() => calculateCompletionPercentage(store?.storeOnboard));
    }, [store?.storeOnboard]);

  return (
    <div className="onboarding--floater" onClick={() => navigate("/")}>
        <span className='floater--container'>
            <span className="flex-align-center" style={{ fontWeight: "600" }}>
                <TbAlignBoxLeftBottomFilled /> onboarding
            </span>
            <span className='floater--inner'>
                <p className="value">{completed}%</p>completed
            </span>
        </span> 
    </div>
  )
}
