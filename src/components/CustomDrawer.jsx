import { ArrowBack, Home, Upload } from '@mui/icons-material';
import { Box, CssBaseline, IconButton, LinearProgress, Stack, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import CustomNotification, { SlideTransition } from './CustomNotification';
import DrawerMenu from './DrawerMenu';
import NotificationBell from './NotificationBell';
import PlayerInDrawer from './PlayerInDrawer';
import SearchUsers from './SearchUsers';

export default function CustomDrawer({ outlet, title, audio, loading, data }) {
    const [initData, setInitData] = data;
    const [error, setError] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    useEffect(() => {
        if (initData?.notification) {
            setError({ open: true, Transition: SlideTransition });
            setTimeout(() => {
                setInitData(prev => {
                    const temp = { ...prev };
                    delete temp.notification;
                    return temp;
                });
            }, initData.notification.duration || 6500);
        }
    }, [initData?.notification]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }}>
                {(loading || initData?.loading) && (
                    <LinearProgress
                        sx={{ position: 'absolute', top: 0, width: '100%' }}
                        variant={initData?.loading?.progress ? 'determinate' : 'indeterminate'}
                        value={initData?.loading?.progress}
                        color="primary"
                    />
                )}
                <Toolbar sx={{ gap: 1 }}>
                    {isHome ? (
                        <IconButton color="inherit" component={RouterLink} to="/" edge="start">
                            <Home />
                        </IconButton>
                    ) : (
                        <IconButton color="inherit" onClick={() => navigate(-1)} edge="start">
                            <ArrowBack />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            fontWeight: 600,
                            flexShrink: 0,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        A project
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <SearchUsers />
                    <NotificationBell />
                    <AvatarInMenu username={initData?.user?.username} avatarURL={initData?.user?.avatarURL} />
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    px: { xs: 1.5, sm: 3 },
                    py: 2,
                    pb: audio ? 10 : 2,
                    maxWidth: 'lg',
                    width: '100%',
                    mx: 'auto'
                }}
            >
                {!loading && outlet}
            </Box>
            <PlayerInDrawer audio={audio} data={data} />
            <CustomNotification val={error} setFlag={setError} type={initData?.notification?.type} msg={initData?.notification?.msg} />
        </Box>
    );
}

function AvatarInMenu({ username, avatarURL }) {
    const [auth, setAuth] = useState(getAuth().currentUser);

    const logout = async () => {
        await signOut(getAuth());
        setAuth();
    };

    useEffect(() => {
        setAuth(getAuth().currentUser || undefined);
    }, [getAuth().currentUser]);

    return (
        <Stack direction="row" gap={0.5} alignItems="center">
            {auth && (
                <IconButton component={RouterLink} to="/upload" color="inherit">
                    <Upload />
                </IconButton>
            )}
            <DrawerMenu auth={auth} username={username} avatarURL={avatarURL} logout={logout} />
        </Stack>
    );
}
