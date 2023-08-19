import { ThemeProvider, createTheme } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CustomDrawer from '../components/CustomDrawer';



export default function Init() {
    const [initData, setInitData] = useState();
    const [title, setTitle] = useState('a project');
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                const temp = {
                    uid: user.uid,
                    email: user.email
                }
                const tempData = { ...initData };
                tempData.user = temp;
                setInitData((val) => {
                    return { ...val, user: temp };
                });
            }
            else {
                const allowPages = ['/login', '/register', '/', '/profile'];
                if (!allowPages.includes(location.pathname)) {
                    navigate('/login', { state: { from: location.pathname } });
                }
                setInitData((val) => {
                    return { ...val, user: null };
                });
            }
            setLoading(false);
        });
    }, [])
    return (
        <>
            <ThemeProvider theme={theme}>
                <CustomDrawer loading={loading} title={initData?.main?.title} audio={initData?.postInPlay} data={[initData, setInitData]} outlet={<Outlet context={[initData, setInitData]} />} />
            </ThemeProvider>
        </>
    )
}

function isDarkModeEnabled() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const theme = createTheme({
    palette: {
        mode: isDarkModeEnabled() ? 'dark' : 'light',
        primary: {
            main: "#8E02B1"
        },
        info: {
            main: "#FFF"
        }
    }
})
