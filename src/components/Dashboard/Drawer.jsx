import { ArrowBack, Dashboard, ListAlt, Person } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Drawer, DrawerHeader } from '../StyledDrawer';
import { labels, windowLang } from '../../utils';

export default function DrawerDashboard({ user, postList }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [title,setTitle] = useState(labels[windowLang]['dashboard']);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
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
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <Tooltip title={labels[windowLang]["dashboard"]} placement='right-end' >
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                component={RouterLink}
                                to=""
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Dashboard />
                                </ListItemIcon>
                                <ListItemText primary={labels[windowLang]["dashboard"]} sx={{ opacity: open ? 1 : 0, ":first-letter": { textTransform: "uppercase" } }} />
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={labels[windowLang]["post"]} placement='right-end'>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                component={RouterLink}
                                to="post"
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ListAlt />
                                </ListItemIcon>
                                <ListItemText primary={labels[windowLang]["post"]} sx={{ opacity: open ? 1 : 0, ":first-letter": { textTransform: "uppercase" } }} />
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={labels[windowLang]["profile"]} placement='right-end'>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                component={RouterLink}
                                to="profile"
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={labels[windowLang]["profile"]} sx={{ opacity: open ? 1 : 0, ":first-letter": { textTransform: "uppercase" } }} />
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                </List>
                <Divider />
                <List sx={{ marginTop: "auto" }} >
                    <Tooltip title={labels[windowLang]["go-back-app"]} placement='right'>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                component={RouterLink}
                                to="/"
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ArrowBack />
                                </ListItemIcon>
                                <ListItemText primary={labels[windowLang]["go-back-app"]} sx={{ opacity: open ? 1 : 0, ":first-letter": { textTransform: "uppercase" } }} />
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                <DrawerHeader />
                <Outlet context={[user, postList,setTitle]} />
            </Box>
        </Box>
    );
}