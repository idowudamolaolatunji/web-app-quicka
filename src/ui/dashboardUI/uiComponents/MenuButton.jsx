import React from 'react'
import { useDataContext } from '../../../context/DataContext';
import { useWindowSize } from 'react-use';
import TooltipUI from '../../../components/TooltipUI';
import DefaultButton from '../../../components/button/DefaultButton';


function MenuButton({ title, icon, action }) {
    const { width } = useWindowSize();
    const { isMenuCollapsed } = useDataContext();

    return (
        <>
            {(width > 900) && (
                <>
                    {isMenuCollapsed ? (
                        <DefaultButton>
                            <TooltipUI title={title}>
                                <div className='menu--button' onClick={action}>
                                    <span className='menu--icon'>{icon}</span>
                                </div>
                            </TooltipUI>
                        </DefaultButton>
                    ) : (
                        <DefaultButton customStyle={{ width: '100%', fontFamily: "inherit" }}>
                            <div className='menu--button' style={{ alignItems: 'center' }} onClick={action}>
                                <span className='menu--icon'>{icon}</span>
                                <p className='menu--text'>{title}</p>
                            </div>
                        </DefaultButton>
                    )}
                </>
            )}
        </>
    )
}


export default MenuButton