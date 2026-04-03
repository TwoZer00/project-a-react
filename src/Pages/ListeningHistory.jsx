import { History } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PostCard from '../components/PostCard';
import { getPostData } from '../firebase/utills';
import { labels, windowLang } from '../utils';
import { getRecentPlays } from '../utils/recentPlays';

export default function ListeningHistory() {
    const [initData, setInitData] = useOutletContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setInitData(val => ({ ...val, main: { ...val?.main, title: labels[windowLang]['listening-history'] } }));
        const load = async () => {
            const recent = getRecentPlays();
            const results = await Promise.all(
                recent.map(r => getPostData(r.id).catch(() => null))
            );
            setPosts(results.filter(Boolean));
            setLoading(false);
        };
        load();
    }, []);

    return (
        <Stack gap={2}>
            <Stack direction="row" gap={1} alignItems="center">
                <History />
                <Typography variant="h6">{labels[windowLang]['listening-history']}</Typography>
            </Stack>
            {!loading && posts.length === 0 && (
                <EmptyState icon="🎧" message={labels[windowLang]['nothing-played']} />
            )}
            <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}>
                {posts.map(post => <PostCard key={post.id} postData={post} />)}
            </Box>
        </Stack>
    );
}
