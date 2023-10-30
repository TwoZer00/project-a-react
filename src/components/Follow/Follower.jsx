import { ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getUserData } from '../../firebase/utills';
import UserAvatar from '../UserAvatar';

export default function FollowerDashboard({ data }) {
    const [user, setUser] = useState();

    useEffect(() => {
        const fetchUser = async () => {
            const temp = await getUserData(data.user.id)
            setUser(temp);
        }
        fetchUser();
    }, [data.user.id])
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to={`/user/${data.user.id}`}>
                    <ListItemAvatar>
                        <UserAvatar username={user?.username} url={user?.avatarURL} />
                    </ListItemAvatar>
                    <ListItemText primary={user?.username} secondary={<Stack direction={"row"}>
                        <Typography variant="body2">{moment.duration(moment(data?.date.seconds * 1000).subtract(new Date())).humanize(true)}</Typography>
                    </Stack>} />
                </ListItemButton>
            </ListItem>
        </>
    )
}
