import { Category, Home, Upload } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { LinearProgress, MenuItem, Tooltip, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomNotification, { SlideTransition } from './CustomNotification';
import DrawerMenu from './DrawerMenu';
import PlayerInDrawer from './PlayerInDrawer';

export default function CustomDrawer({ outlet, title, audio, loading, data }) {
    const theme = useTheme();
    const [initData, setInitData] = data;
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!matches) {
            handleDrawerClose();
        }
        else {
            handleDrawerOpen();
        }
    }, [matches])

    useEffect(() => {
        if (initData?.notification) {
            setError({ open: true, Transition: SlideTransition });
            setTimeout(() => {
                setInitData(prev => {
                    const temp = { ...prev }
                    delete temp.notification
                    return temp
                })
            }, initData.notification.duration || 6500)
        }
    }, [initData?.notification])

    return (
        <>
            <Box sx={{ display: 'flex', position: "relative" }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    {(loading || initData?.loading) &&
                        <LinearProgress sx={{ position: "absolute", top: "0", width: "100vw" }} variant={initData?.loading?.progress ? "determinate" : "indeterminate"} value={initData?.loading?.progress} color='primary' />
                    }
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h1" noWrap textAlign={"center"} flex={1} textTransform={"uppercase"} fontSize={20} letterSpacing={1} fontWeight={500}>
                            {title}
                        </Typography>
                        <AvatarInMenu username={initData?.user?.username} avatarURL={initData?.user?.avatarURL} />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={{ height: "100vh" }}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={!matches && "Home"} placement="right" >
                                <ListItemButton
                                    component={RouterLink}
                                    to="/"
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}>
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}>
                                        <Home />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </Tooltip>
                            <Tooltip title={!matches && "Categories"} placement="right">
                                <ListItemButton
                                    component={RouterLink}
                                    to="/categories"
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}>
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}>
                                        <Category />
                                    </ListItemIcon>
                                    <ListItemText primary="Categories" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    </List>
                    <List sx={{ height: "100%", display: "flex", flexDirection: "column" }} >
                        <ListItem sx={{ mt: "auto" }}>
                            <PlayerInDrawer open={open} audio={audio} data={data} />
                        </ListItem>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, height: "100vh", display: "flex", flexDirection: "column", position: 'relative', px: 2, py: 2, overflow: "auto" }}>
                    <DrawerHeader />
                    {!loading && outlet}
                    <CustomNotification val={error} setFlag={setError} type={initData?.notification?.type} msg={initData?.notification?.msg} />
                </Box >
            </Box >
        </>
    );
}


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const AvatarInMenu = ({ username, avatarURL }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [auth, setAuth] = useState(getAuth().currentUser);
    const handleChange = (event) => {
        setAuth(event.target.checked);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = async () => {
        await signOut(getAuth());
        setAuth();
    }
    useEffect(() => {
        if (getAuth().currentUser) {
            setAuth(getAuth().currentUser)
        }
        else {
            setAuth();
        }
    }
        , [getAuth().currentUser])
    return (
        <>
            {auth && <IconButton component={RouterLink} to={"/upload"} color='inherit'>
                <Upload />
            </IconButton>}
            <DrawerMenu auth={auth} username={username} avatarURL={avatarURL} logout={logout} />
        </>
    )
}


const AvatarInMenuLoggedMenuItems = ({ handleClose }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await signOut(getAuth());
        handleClose();
    }
    const handleProfile = () => {
        handleClose();
        navigate(`/user/${getAuth().currentUser?.uid}`);
    }
    const handleSettings = () => {
        handleClose();
        navigate("/settings/preferences");
    }
    const handleMyAccount = () => {
        handleClose();
        navigate("/settings/profile");
    }
    return (
        <>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleMyAccount}>My account</MenuItem>
            <MenuItem onClick={handleSettings}>Settings</MenuItem>
            <MenuItem onClick={handleLogout} >Logout</MenuItem>
        </>
    )
}

const AvatarInMenuLoggedMenuItemsNotLoggedIn = ({ handleClose }) => {
    return (
        <>
            <MenuItem onClick={handleClose} >Login</MenuItem>
        </>
    )
}