import { Alert, Slide, Snackbar } from '@mui/material';
import React from 'react';

export default function CustomNotification({ val, setFlag, msg, type, duration = 6000 }) {
    const handleClose = () => {
        setFlag({
            ...val,
            open: false,
        });
    };

    if (!type) {
        return (
            <Snackbar
                open={val?.open}
                autoHideDuration={duration}
                onClose={handleClose}
                TransitionComponent={val?.Transition}
                message={msg}
                key={val?.Transition.name}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        )
    }
    else {
        return (
            <Snackbar
                open={val?.open}
                autoHideDuration={duration}
                onClose={handleClose}
                TransitionComponent={val?.Transition}
                key={val?.Transition.name}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={type}>{msg}</Alert>
            </Snackbar>
        )
    }
}

export function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}