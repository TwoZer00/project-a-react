import { ThemeProvider, createTheme } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import CustomDrawer from '../components/CustomDrawer';
import { getAvatarImage, getUserData } from '../firebase/utills';

export default function Init() {
    const auth = useLoaderData();
    const [initData, setInitData] = useState();
    const [title, setTitle] = useState('a project');
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const authState = onAuthStateChanged(auth, async (user) => {
            // console.log(location.pathname, "bbbb");
            if (user) {
                const temp = {
                    uid: user.uid,
                    email: user.email
                }
                let userData;
                try {
                    userData = await getUserData(user.uid);
                    userData.avatarURL = userData.avatarURL ? (await getAvatarImage(userData.avatarURL)) : undefined;
                    const tempData = { ...initData };
                    tempData.user = userData;
                    setInitData((val) => {
                        return { ...val, user: userData };
                    });
                } catch (error) {
                    if (error.code == 101) navigate('settings/profile')
                }
            }
            else {
                setInitData((val) => {
                    const temp = { ...val };
                    delete temp.user;
                    return temp
                });
                // console.log(location.pathname);
                // const loggedPagges = ['/upload', '/settings/profile'];
                // console.log(loggedPagges.includes(location.pathname), location.pathname);
                // if (loggedPagges.includes(location.pathname)) navigate('/login', { state: { from: location }, replace: true })
            }

            // if ((location.pathname).includes('upload')) navigate('/login')
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
            // console.log(preferences);
            setInitData((val) => {
                return { ...val, preferences };
            });
        }
        setInitData((val) => {
            const temp = { ...val }
            const main = { "title": "a project" }
            temp.main = { ...main };
            return temp;
        })
        return () => authState();
    }, [])
    useEffect(() => {
        if (initData?.preferences) {
            const tempPrefs = { ...initData?.preferences }
            delete tempPrefs.theme;
            localStorage.setItem("preferences", JSON.stringify(tempPrefs))
        }
    }, [initData?.preferences])
    useEffect(() => {
        if (initData?.main?.title) {
            document.title = initData?.main?.title;
        }
    }, [initData?.main?.title])

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
