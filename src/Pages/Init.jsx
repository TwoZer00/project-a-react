import { ThemeProvider, createTheme } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CustomDrawer from '../components/CustomDrawer';
import { getUserData } from '../firebase/utills';
import { doc, getFirestore } from 'firebase/firestore';



export default function Init() {
    const [initData, setInitData] = useState();
    const [title, setTitle] = useState('a project');
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                const temp = {
                    uid: user.uid,
                    email: user.email
                }
                const userData = await getUserData(doc(getFirestore(), 'user', user.uid));
                const tempData = { ...initData };
                tempData.user = userData;
                setInitData((val) => {
                    return { ...val, user: userData };
                });
            }
            else {
                const allowPages = ['/login', '/register', '/', '/user'];
                if (!allowPages.includes((location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1)))) {
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
