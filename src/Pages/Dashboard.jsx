import { ThemeProvider } from '@mui/material'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import DrawerDashboard from '../components/Dashboard/Drawer'
import { getPostsUser, getUserData } from '../firebase/utills'
import { theme } from './Init'

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useLoaderData();
    const [user, setUser] = useState();
    const [posts, setPosts] = useState();
    const location = useLocation();
    useEffect(() => {
        const authState = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const temp = await getUserData(user.uid);
                const posts = await getPostsUser(user.uid);
                setUser(temp);
                setPosts(posts);
            }
            else {
                setUser();
                setPosts();
                navigate('/login', { state: { from: location } });
            }
        })
        return () => authState();
    }, [])
    return (
        <>
            <ThemeProvider theme={theme} >
                <DrawerDashboard user={[user, setUser]} postList={[posts, setPosts]} />
            </ThemeProvider>
        </>
    )
}
