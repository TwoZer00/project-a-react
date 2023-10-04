import { ThemeProvider, createTheme } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import CustomDrawer from '../components/CustomDrawer';
import { getUserData } from '../firebase/utills';
import { doc, getFirestore } from 'firebase/firestore';



export default function Init() {
    const auth = useLoaderData();
    const [initData, setInitData] = useState();
    const [title, setTitle] = useState('a project');
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
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
                // const allowPages = ['/login', '/register', '/', '/user', '/settings'];
                // if (!allowPages.includes((location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1)))) {
                //     navigate('/login', { state: { from: location.pathname } });
                // }
                setInitData((val) => {
                    const temp = { ...val };
                    delete temp.user;
                    // temp.preferences.nsfw = undefined
                    return temp
                });
            }
            setLoading(false);
        });
        if (localStorage.getItem('preferences')) {
            const tempTheme = createTheme({
                palette: {
                    ...paletteTemp.palette,
                    mode: JSON.parse(localStorage.getItem('preferences')).selectedTheme === "default" ? isDarkModeEnabled() ? "dark" : "light" : JSON.parse(localStorage.getItem('preferences')).selectedTheme
                }
            });
            const preferences = { theme: tempTheme }
            preferences.nsfw = JSON.parse(localStorage.getItem('preferences')).nsfw;
            preferences.selectedTheme = JSON.parse(localStorage.getItem('preferences')).selectedTheme;
            console.log(preferences);
            setInitData((val) => {
                return { ...val, preferences };
            });
        }
    }, [])
    useEffect(() => {
        if (initData?.preferences) {
            const tempPrefs = { ...initData?.preferences }
            delete tempPrefs.theme;
            localStorage.setItem("preferences", JSON.stringify(tempPrefs))
        }
    }, [initData?.preferences])
    return (
        <>
            <ThemeProvider theme={initData?.preferences?.theme || theme}>
                <CustomDrawer loading={loading} title={initData?.main?.title} audio={initData?.postInPlay} data={[initData, setInitData]} outlet={<Outlet context={[initData, setInitData]} />} />
            </ThemeProvider>
        </>
    )
}

export function isDarkModeEnabled() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export let theme = createTheme({
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

export const paletteTemp = {
    palette: {
        primary: {
            main: "#8E02B1"
        },
        info: {
            main: "#FFF"
        }
    }
}