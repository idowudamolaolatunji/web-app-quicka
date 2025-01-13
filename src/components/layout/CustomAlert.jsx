import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import { AlertTitle, Snackbar } from '@mui/material';
import { useWindowSize } from 'react-use';

function CustomAlert({ type, message, duration=5000 }) {
    const [open, setOpen] = useState(true);
    const { width } = useWindowSize();
    const mobile = width <= 450;
    // Serverity = success, info, warning, error || variant = standard, outline, filled

    const origin = {
        vertical: mobile ? 'top' : 'bottom',
        horizontal: 'left'
    }
    const variant = mobile ? 'standard' : 'filled'


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={origin}
        >
            <Alert
                onClose={handleClose}
                severity={type}
                variant={variant}
                sx={{ width: '100%', fontFamily: 'inherit', fontSize: '1.6rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default CustomAlert