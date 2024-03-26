import { useTheme } from '@emotion/react';
import { AccountCircleOutlined, Dashboard, Logout, MoreVert, Settings } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';

export default function DrawerMenu({ auth, username, avatarURL, logout }) {
    const theme = useTheme();
    const [menuState, setMenuState] = useState(false)
    const [anchorEl, setAnchorEl] = useState();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false)
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl();
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleLogout = () => {
        setOpenDialog(true);

    }
    return (
        <Stack direction={"row"} gap={1}>
            {!auth && <Button component={RouterLink} to={"/login"} variant="outlined" startIcon={<AccountCircleOutlined />} sx={{ borderRadius: 9, '.MuiButton-startIcon': { padding: `${!matches && "0"}`, margin: `${!matches && "0"}` }, padding: `${!matches && "0"}` }} color='inherit'>
                {matches && "Sign in"}
            </Button>}
            {auth ?
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    disableRipple
                >
                    <UserAvatar username={username || auth.email} url={auth.photoURL || avatarURL} width={35} height={35} />
                </IconButton> :
                <IconButton color='inherit' onClick={handleMenu} >
                    <MoreVert />
                </IconButton>}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {auth &&
                    <MenuItem component={RouterLink} to={`/user/${auth.uid}`} sx={{ height: 60 }} >
                        <Stack direction={"row"} gap={1} sx={{ height: "100%" }} alignItems={"center"} >
                            <UserAvatar username={username || auth.email} url={auth.photoURL || avatarURL} />
                            <Stack direction={"column"}>
                                <Typography variant='body1'>{username}</Typography>
                                <Typography variant="caption">{auth.email}</Typography>
                            </Stack>
                        </Stack>
                    </MenuItem>
                }
                {
                    auth &&
                    <Divider />
                }
                <MenuItem component={RouterLink} to={"settings"} >
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                {auth && <MenuItem component={RouterLink} to={"dashboard"}>
                    <ListItemIcon>
                        <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                </MenuItem>}
                {auth &&
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                }
            </Menu>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to logout?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This will clear all your data. You can always login again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={() => { logout(); handleCloseDialog() }} autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
