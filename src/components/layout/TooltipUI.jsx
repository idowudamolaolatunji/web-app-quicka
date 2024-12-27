import React from 'react'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { styled } from '@mui/material';


const TooltipStyled = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        boxShadow: theme.shadows[1],
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit'
    },
}));

function TooltipUI({ title, placement="right", children }) {
    return (
        <TooltipStyled
            arrow={placement == "bottom" ? true : false}
            title={title}
            TransitionComponent={Zoom}
            enterDelay={250}
            enterNextDelay={150}
            placement={placement}
            disableInteractive
        >
            {children}
        </TooltipStyled>
    )
}

export default TooltipUI