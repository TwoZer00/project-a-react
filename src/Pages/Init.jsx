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
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const temp = {
                    uid: user.uid,
                    email: user.email
                }
                let userData;
                try {
                    userData = await getUserData(user.uid);
                    userData.avatarURL = await getAvatarImage(userData.avatarURL);
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
