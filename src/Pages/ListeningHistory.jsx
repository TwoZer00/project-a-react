import { History, Radio } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PostListItem from '../components/PostListItem';
import { getAudioUrl, getPostData, getUserData } from '../firebase/utills';
import { labels, windowLang } from '../utils';
import { getRecentPlays } from '../utils/recentPlays';

export default function ListeningHistory() {
    const [initData, setInitData] = useOutletContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [playing, setPlaying] = useState(false);

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

    const handlePlayStation = async () => {
        if (posts.length === 0) return;
        setPlaying(true);
        const shuffled = [...posts];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const first = shuffled[0];
        const url = await getAudioUrl(first.filePath);
        const userData = await getUserData(first.user.id);
        setInitData(val => ({
            ...val,
            postInPlay: {
                title: first.title,
                desc: first.desc || '',
                id: first.id,
                userId: first.user.id,
                isAudioInProgress: [false],
                audioUrl: url,
                username: userData.username,
                cover: first.coverURL || userData.avatarURL
            },
            station: {
                name: labels[windowLang]['listening-history'],
                queue: shuffled,
                currentIndex: 0
            }
        }));
        setPlaying(false);
    };

    const isStationPlaying = initData?.station?.name === labels[windowLang]['listening-history'];

    return (
        <Stack gap={2}>
            <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
                <Stack direction="row" gap={1} alignItems="center">
                    <History />
                    <Typography variant="h6">{labels[windowLang]['listening-history']}</Typography>
                </Stack>
                {posts.length > 0 && (
                    <Button
                        variant={isStationPlaying ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<Radio />}
                        onClick={handlePlayStation}
                        disabled={playing}
                    >
                        {isStationPlaying ? labels[windowLang]['playing'] : labels[windowLang]['play-all']}
                    </Button>
                )}
            </Stack>
            {!loading && posts.length === 0 && (
                <EmptyState icon="🎧" message={labels[windowLang]['nothing-played']} />
            )}
            <Box>
                {posts.map(post => <PostListItem key={post.id} postData={post} />)}
            </Box>
        </Stack>
    );
}
