import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatNumber } from '../../utils/helper';
import Skeleton from 'react-loading-skeleton';

function Insight({ title, value, icon, link, pre = "", dec = 0, loader }) {
    const navigate = useNavigate();

    return (
        <>
            {loader ? (
                // <Skeleton count={5} height={10} />
                <Skeleton height={80} />
            ) : (
                <figure className='insight--figure'
                    onClick={() => link && navigate(`/dashboard${link}`)}
                    style={!link ? { cursor: 'auto' } : {}}
                >
                    <div className='insight--info'>
                        <p className='text'>{title}</p>
                        <span className='value'>{pre}{formatNumber(value, dec)}</span>
                    </div>
                    <span className='insight--icon'>{icon}</span>
                </figure>
            )}

        </>
    )
}

export default Insight