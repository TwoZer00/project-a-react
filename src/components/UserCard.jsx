import { Avatar, Box, Link } from '@mui/material';
import React from 'react'
import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { stringAvatar } from './PostCard';

export default function UserCard(props) {
    useEffect(() => {
        // console.log(props.data);
    }, []);
    return (
        <Box>
            <Link component={RouterLink} to={`/user/${props.data?.id}`} underline='none'>
                <Avatar src={props.data?.avatar} {...stringAvatar(props.data?.username, { width: 40, height: 40 })} />
            </Link>
        </Box>
    )
}
