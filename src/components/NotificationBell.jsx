import { Comment, Favorite, Notifications, PersonAdd, Reply } from '@mui/icons-material';
import { Badge, Box, Divider, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Popover, Stack, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAllRead } from '../firebase/notifications';
import { getUserData } from '../firebase/utills';
import { labels, windowLang } from '../utils';
import UserAvatar from './UserAvatar';

export default function NotificationBell() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const userId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (!userId) return;
        getUnreadCount(userId).then(setUnread);
    }, [userId]);

    const handleOpen = async (e) => {
        setAnchorEl(e.currentTarget);
        if (!userId) return;
        const notifs = await getNotifications(userId);
        setNotifications(notifs);
        if (unread > 0) {
            await markAllRead(userId);
            setUnread(0);
        }
    };

    if (!userId) return null;

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unread} color="error" max={99}>
                    <Notifications />
                </Badge>
            </IconButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 320, maxHeight: 400 } } }}
            >
                <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        {labels[windowLang]['notifications'] || 'Notifications'}
                    </Typography>
                </Box>
                {notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            {labels[windowLang]['no-notifications'] || 'No notifications yet'}
                        </Typography>
                    </Box>
                ) : (
                    <List dense disablePadding sx={{ overflow: 'auto' }}>
                        {notifications.map(n => (
                            <NotificationItem key={n.id} notification={n} onClose={() => setAnchorEl(null)} />
                        ))}
                    </List>
                )}
            </Popover>
        </>
    );
}

function NotificationItem({ notification, onClose }) {
    const [fromUser, setFromUser] = useState(null);
    const n = notification;

    useEffect(() => {
        if (n.fromUser?.id) getUserData(n.fromUser.id).then(setFromUser).catch(() => {});
    }, [n.fromUser]);

    const icon = {
        follow: <PersonAdd fontSize="small" color="primary" />,
        comment: <Comment fontSize="small" color="info" />,
        reply: <Reply fontSize="small" color="info" />,
        like: <Favorite fontSize="small" color="error" />,
    }[n.type] || <Notifications fontSize="small" />;

    const message = {
        follow: `${fromUser?.username || '...'} started following you`,
        comment: `${fromUser?.username || '...'} commented on your post`,
        reply: `${fromUser?.username || '...'} replied to your comment`,
        like: `${fromUser?.username || '...'} liked your post`,
    }[n.type] || 'New notification';

    const link = n.postId ? `/post/${n.postId}` : n.type === 'follow' ? `/user/${n.fromUser?.id}` : '/';

    return (
        <ListItem
            disablePadding
            sx={{ bgcolor: n.read ? 'transparent' : 'action.hover' }}
        >
            <Link
                component={RouterLink}
                to={link}
                onClick={onClose}
                underline="none"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, width: '100%' }}
            >
                <UserAvatar url={fromUser?.avatarURL} username={fromUser?.username} width={32} height={32} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>{message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString() : ''}
                    </Typography>
                </Box>
                {icon}
            </Link>
        </ListItem>
    );
}
