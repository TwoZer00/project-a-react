import { Headphones, Radio } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { getAudioUrl, getAvatarImage, getInterludesByType, getPostsUser, getUserData } from '../firebase/utills';
import UserAvatar from './UserAvatar';

export default function StationCard({ userId, station }) {
    const [initData, setInitData] = useOutletContext();
    const [user, setUser] = useState(null);
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [userData, posts] = await Promise.all([
                getUserData(userId),
                getPostsUser(userId, 5)
            ]);
            if (userData.avatarURL) {
                try { userData.avatarURL = await getAvatarImage(userData.avatarURL); } catch (e) {}
            }
            setUser(userData);
            setPostCount(posts.filter(p => p.visibility === 'public').length);
        };
        load();
    }, [userId]);

    const handlePlay = async () => {
        setLoading(true);
        const posts = await getPostsUser(userId);
        let tracks = posts.filter(p => p.visibility === 'public');
        if (station?.postIds) {
            tracks = tracks.filter(p => station.postIds.includes(p.id));
        }
        if (tracks.length === 0) { setLoading(false); return; }

        if (!station || station.shuffle !== false) {
            for (let i = tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
        }

        const [intros, betweens, outros] = await Promise.all([
            getInterludesByType(userId, 'intro'),
            getInterludesByType(userId, 'between'),
            getInterludesByType(userId, 'outro'),
        ]);

        const queue = [];
        if (intros.length > 0) queue.push({ ...intros[Math.floor(Math.random() * intros.length)], isInterlude: true });
        tracks.forEach((post, i) => {
            queue.push(post);
            if (i < tracks.length - 1 && betweens.length > 0) {
                queue.push({ ...betweens[Math.floor(Math.random() * betweens.length)], isInterlude: true });
            }
        });
        if (outros.length > 0) queue.push({ ...outros[Math.floor(Math.random() * outros.length)], isInterlude: true });

        const first = queue[0];
        const url = await getAudioUrl(first.filePath);
        const stationName = station?.name || `${user.username}'s station`;
        const firstUsername = first.isInterlude ? user.username : (await getUserData(first.user.id)).username;

        setInitData(val => ({
            ...val,
            postInPlay: {
                title: first.title,
                desc: first.desc || '',
                id: first.id,
                userId: first.isInterlude ? userId : first.user.id,
                isAudioInProgress: [false],
                audioUrl: url,
                username: firstUsername,
                cover: first.isInterlude ? undefined : first.coverURL,
                isInterlude: first.isInterlude
            },
            station: { name: stationName, queue, currentIndex: 0 }
        }));
        setLoading(false);
    };

    const stationName = station?.name || (user ? `${user.username}'s station` : '');
    const isPlaying = initData?.station?.name === stationName;

    if (!user) {
        return (
            <Card variant="outlined" sx={{ minWidth: 220, flexShrink: 0 }}>
                <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton width="70%" height={20} />
                        <Skeleton width="40%" height={16} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            variant={isPlaying ? 'elevation' : 'outlined'}
            elevation={isPlaying ? 4 : 0}
            sx={{
                minWidth: 220,
                flexShrink: 0,
                borderColor: isPlaying ? 'primary.main' : undefined,
                borderWidth: isPlaying ? 2 : 1,
            }}
        >
            <CardActionArea onClick={handlePlay} disabled={loading}>
                <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 1.5 }}>
                    <Box sx={{ position: 'relative' }}>
                        <UserAvatar url={user.avatarURL} username={user.username} width={48} height={48} />
                        {isPlaying && (
                            <Box sx={{
                                position: 'absolute', bottom: -4, right: -4,
                                bgcolor: 'primary.main', borderRadius: '50%',
                                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Headphones sx={{ fontSize: 12, color: 'white' }} />
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                            {station?.name || user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {station ? `${station.postIds?.length || 0} tracks` : `${postCount} tracks`}
                        </Typography>
                        {isPlaying && (
                            <Chip label="Now playing" size="small" color="primary" sx={{ height: 18, fontSize: 10, mt: 0.5 }} />
                        )}
                    </Box>
                    <Radio color={isPlaying ? 'primary' : 'action'} />
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
