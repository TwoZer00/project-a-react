import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import CommentDashboard from '../../components/Comments/CommentDashboard';
import FollowerDashboard from '../../components/Follow/Follower';
import { getComments } from '../../firebase/utills';
import { countPlays, labels, windowLang } from '../../utils';

export default function HomeDashboard() {
    const [posts, setPosts] = useState();
    const [[user, setUser], postList,setTitle] = useOutletContext();
    const [plays, setPlays] = useState(0);
    const [comments, setComments] = useState();
    useEffect(() => {
        setTitle(labels[windowLang]['dashboard']);
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
                    <Box textAlign={"center"}>
                        <Typography variant="h2" fontSize={24}>{labels[windowLang]['posts']}</Typography>
                        <Typography variant="body1" >{(posts?.length.toLocaleString(window.navigator.language, { style: "decimal" }))}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem variant="middle" />
                    <Box textAlign={"center"}>
                        <Typography variant="h2" fontSize={24}>{labels[windowLang]['plays']}</Typography>
                        <Typography variant="body1">{plays.toLocaleString(window.navigator.language, { style: "decimal" })}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem variant="middle" />
                    <Box textAlign={"center"}>
                        <Typography variant="h2" fontSize={24}>{labels[windowLang]['followers']}</Typography>
                        <Typography variant="body1" >{user?.followers?.length.toLocaleString(window.navigator.language, { style: "decimal" }) || 0}</Typography>
                    </Box>
                </Stack>
            </Box>
            <Box component={Paper} variant='outlined' p={1}>
                <Typography variant="h2" fontSize={24}>{labels[windowLang]['latest-posts']}</Typography>
                <Box>
                    <List subheader={<ListSubheader sx={{ display: "flex", gap: 1, }} ><Typography variant="subtitle1" flexGrow={1} >{labels[windowLang]['title']}</Typography>
                        <Typography variant="subtitle1">{labels[windowLang]['plays']}</Typography>
                        <Typography variant="subtitle1">{labels[windowLang]['comments']}</Typography></ListSubheader>} >
                        {posts?.slice(0, 4).map((post) => (
                            <ListItem disablePadding key={post.id}>
                                <ListItemButton key={post.id} component={RouterLink} to={`/dashboard/post/${post.id}`}>
                                    <ListItemText primary={post.title} />
                                    <Stack direction={"row"} gap={1}>
                                        <Typography variant="subtitle1" sx={{ width: "5ch" }} align='right'>{post.plays?.toLocaleString(window.navigator.language, { style: "decimal", notation: "compact", roundingPriority: "morePrecision" })}</Typography>
                                        <Typography variant="subtitle1" sx={{ width: "8ch" }} align='right'>{post.comment ? post.comment?.length?.toLocaleString(window.navigator.language, { style: "decimal", roundingPriority: "morePrecision", notation: "compact" }) : 0}</Typography>
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {posts?.length === 0 && <Typography variant="body1" textAlign={"center"}>{labels[windowLang]['no-posts']}</Typography>}
                </Box>
            </Box>
            <Box component={Paper} variant='outlined' p={1}>
                <Typography variant="h2" fontSize={24}>{labels[windowLang]['latest-comments']}</Typography>
                <List>
                    {
                        comments?.length > 0 ? comments?.slice(0, 4).map((item) => {
                            return <CommentDashboard key={item.id} data={item} />;
                        })
                            :
                            <Typography variant="body1" textAlign={"center"}>{labels[windowLang]['no-comments']}</Typography>
                    }
                </List>
            </Box>
            <Box component={Paper} variant='outlined' p={1}>
                <Typography variant="h2" fontSize={24}>{labels[windowLang]['latest-followers']}</Typography>
                <List>
                    {
                        user?.followers?.length > 0 ? user?.followers?.slice(0, 4).map((item) => {
                            return <FollowerDashboard key={item.id} data={item} />;
                        })
                            :
                            <Typography variant="body1" textAlign={"center"}>{labels[windowLang]['no-followers']}</Typography>
                    }
                </List>
            </Box>
        </Stack>
    )
}
