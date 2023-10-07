import { AccountCircle, AccountCircleOutlined, Logout, MoreVert, PersonAdd, Settings } from '@mui/icons-material';
import { Avatar, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useState } from 'react'
import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import UserAvatar from './UserAvatar';

export default function DrawerMenu({ auth, username, avatarURL, logout }) {
    const [menuState, setMenuState] = useState(false)
    const [anchorEl, setAnchorEl] = useState();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl();
    }
    return (
        <Stack direction={"row"} gap={1}>
            {!auth && <Button component={RouterLink} to={"/login"} variant="outlined" startIcon={<AccountCircleOutlined />} sx={{ borderRadius: 9 }} color='inherit'>
                Sign in
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
                    <UserAvatar username={username} url={auth.photoURL || avatarURL} width={35} height={35} />
                </IconButton> :
                <IconButton onClick={handleMenu} >
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
                    <MenuItem component={RouterLink} to={"/user"} sx={{ height: 60 }} >
                        <Stack direction={"row"} gap={1} sx={{ height: "100%" }} alignItems={"center"} >
                            <UserAvatar username={username} url={auth.photoURL || avatarURL} />
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
                <MenuItem component={RouterLink} to={"settings/preferences"} >
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                {auth &&
                    <MenuItem onClick={() => { logout(); handleClose() }}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                }
            </Menu>
        </Stack>
    )
}
