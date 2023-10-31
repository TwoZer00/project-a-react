import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import CommentDashboard from '../../components/Comments/CommentDashboard';
import FollowerDashboard from '../../components/Follow/Follower';
import { getComments } from '../../firebase/utills';
import { countPlays } from '../../utils';

export default function HomeDashboard() {
    const [posts, setPosts] = useState();
    const [user, postList] = useOutletContext();
    const [plays, setPlays] = useState();
    const [comments, setComments] = useState();
    useEffect(() => {
        const fetchPosts = async () => {
            const [postLista, setPostLista] = postList;
            setPlays(countPlays(postLista));
            setPosts(postLista);
        }
        const fetchComments = async () => {
            const temp = await getComments(user.id);
            setComments(temp);
        }
        if (user?.id) {
            fetchPosts();
            fetchComments();
        }
    }, [user]);
    return (
        <Stack gap={2} p={2} >
            <Box component={Paper} variant='outlined' p={1}>
                <Stack direction={"row"} justifyContent={"space-around"}>
                    <Box>
                        <Typography variant="h2" fontSize={24}>Posts</Typography>
                        <Typography variant="body1" textAlign={"center"}>{(posts?.length)}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem variant="middle" />
                    <Box>
                        <Typography variant="h2" fontSize={24}>Plays</Typography>
                        <Typography variant="body1" textAlign={"center"}>{plays}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem variant="middle" />
                    <Box>
                        <Typography variant="h2" fontSize={24}>Follower</Typography>
                        <Typography variant="body1" textAlign={"center"}>{user?.followers?.length || 0}</Typography>
                    </Box>
                </Stack>
            </Box>
            <Box component={Paper} variant='outlined' p={1}>
                <Typography variant="h2" fontSize={24}>Recent Posts</Typography>
                <Box>
                    <List subheader={<ListSubheader sx={{ display: "flex", gap: 1, }} ><Typography variant="subtitle1" flexGrow={1} >Title</Typography>
                        <Typography variant="subtitle1">Plays</Typography>
                        <Typography variant="subtitle1">Comments</Typography></ListSubheader>} >
                        {posts?.slice(0, 4).map((post) => (
                            <ListItem disablePadding>
                                <ListItemButton key={post.id} component={RouterLink} to={`/dashboard/post/${post.id}`}>
                                    <ListItemText primary={post.title} />
                                    <Stack direction={"row"} gap={1}>
                                        <Typography variant="subtitle1" sx={{ width: "5ch" }} align='right'>{post.plays}</Typography>
                                        <Typography variant="subtitle1" sx={{ width: "8ch" }} align='right'>{post.comment ? post.comment.length : 0}</Typography>
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {posts?.length === 0 && <Typography variant="body1" textAlign={"center"}>No posts</Typography>}
                </Box>
            </Box>
            <Box component={Paper} variant='outlined' p={1}>
                <Typography variant="h2" fontSize={24}>Latest comments</Typography>
                <List>
                    {
                        comments?.length > 0 ? comments?.slice(0, 4).map((item) => {
                            return <CommentDashboard key={item.id} data={item} />;
                        })
                            :
                            <Typography variant="body1" textAlign={"center"}>No comments</Typography>
                    }
                </List>
            </Box>
            <Box component={Paper} variant='outlined' p={1}>
                <Typography variant="h2" fontSize={24}>Latest followers</Typography>
                <List>
                    {
                        user?.followers?.length > 0 ? user?.followers?.slice(0, 4).map((item) => {
                            return <FollowerDashboard key={item.id} data={item} />;
                        })
                            :
                            <Typography variant="body1" textAlign={"center"}>No followers</Typography>
                    }
                </List>
            </Box>
        </Stack>
    )
}
