import { ThemeProvider, createTheme } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import CustomDrawer from '../components/CustomDrawer';



export default function Init() {
    const [initData, setInitData] = useState();
    const [title, setTitle] = useState('a project');
    const theme = createTheme({
        palette: {
            mode: isDarkModeEnabled() ? 'dark' : 'light',
            primary: {
                main: "#8E02B1"
            }
        }
    })
    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                const temp = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }
                const tempData = { ...initData };
                tempData.user = temp;
                setInitData(tempData);
            }
        });
    }, [])
    return (
        <>
            <ThemeProvider theme={theme}>
                <CustomDrawer title={initData?.main?.title} audio={initData?.postInPlay} outlet={<Outlet context={[initData, setInitData]} />} />
            </ThemeProvider>
        </>
    )
}

function isDarkModeEnabled() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
