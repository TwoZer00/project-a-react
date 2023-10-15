import { Alert, Fade, Slide, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'

export default function CustomNotification({ val, setFlag, msg, type }) {
    // const [state, setState] = useState({
    //     open: false,
    //     Transition: SlideTransition,
    // });

    // function SlideTransition(props) {
    //     return <Slide {...props} direction="up" onExiting={() => { console.log("hellowa"); }} />;
    // }

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
                autoHideDuration={2000}
                onClose={handleClose}
                TransitionComponent={val?.Transition}
                message={msg}
                key={val?.Transition.name}
            />
        )
    }
    else {
        return (
            <Snackbar
                open={val?.open}
                autoHideDuration={2000}
                onClose={handleClose}
                TransitionComponent={val?.Transition}
                key={val?.Transition.name}
            >
                <Alert severity={type}>{msg}</Alert>
            </Snackbar>
        )
    }
}

export function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}