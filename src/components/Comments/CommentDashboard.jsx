import { ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getPostData, getUserData } from '../../firebase/utills';
import UserAvatar from '../UserAvatar';
import { inTime } from './Comment';

export default function CommentDashboard({ data }) {
    // console.log(data.id);
    const [user, setUser] = useState();
    const [post, setPost] = useState();
    useEffect(() => {
        const fetchUser = async () => {
            const temp = await getUserData(data?.user.id);
            setUser(temp);
        }
        const fetchPost = async () => {
            const temp = await getPostData(data?.post.id);
            setPost(temp);
        }
        fetchUser();
        fetchPost();
    }, [])
    return (
        <ListItem disablePadding>
            <ListItemButton component={RouterLink} to={`/post/${data.post.id}?comment=${data.id}`}>
                <ListItemAvatar>
                    <UserAvatar username={user?.username} url={user?.avatarURL} />
                </ListItemAvatar>
                <ListItemText primary={user?.username} secondary={<Stack direction={"row"}>
                    <Typography variant="body2" mr={1}>Commented on: {post?.title}</Typography>
                    "<Typography variant="body2" maxWidth={"15"} textOverflow={'ellipsis'} whiteSpace={"nowrap"} overflow={"hidden"} >{data?.content}</Typography>"
                    <Typography variant="body2" ml={1}>{inTime(data?.creationTime)}</Typography>
                </Stack>} />
            </ListItemButton>
        </ListItem>
    )
}
