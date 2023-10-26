import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { countPlays } from '../../utils';

export default function HomeDashboard() {
    const [posts, setPosts] = useState();
    const [user, postList] = useOutletContext();
    const [plays, setPlays] = useState();
    useEffect(() => {
        const fetchPosts = async () => {
            const [postLista, setPostLista] = postList;
            setPlays(countPlays(postLista));
            setPosts(postLista);
        }
        if (user?.id) {
            fetchPosts();
        }
    }, [user]);
    return (
        <Stack gap={2}>
            <Box component={Paper} variant='outlined' >
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
                </Stack>
            </Box>
            <Box component={Paper} variant='outlined'>
                <Typography variant="h2" fontSize={24}>Recent Posts</Typography>
                <Box>
                    {posts?.slice(0, 4).map((post) => (
                        <Typography key={post.id} variant="body1">{post.title}</Typography>
                    ))}
                    {posts?.length === 0 && <Typography variant="body1">No posts</Typography>}
                </Box>
            </Box>
        </Stack>
    )
}
