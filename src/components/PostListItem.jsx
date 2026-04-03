import { BarChart, Comment } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, Chip, Link, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { useUserCache } from '../context/UserCacheContext';
import { windowLang } from '../utils';
import BookmarkButton from './BookmarkButton';
import LikeButton from './LikeButton';
import PlayButton from './PlayButton';
import UserAvatar from './UserAvatar';
import { inTime } from './Comments/Comment';
dayjs.extend(relativeTime);

export default function PostListItem({ postData }) {
    const [user, setUser] = useState();
    const { users, getUser } = useUserCache();

    useEffect(() => { getUser(postData.user.id); }, []);
    useEffect(() => {
        if (users[postData.user.id]) setUser(users[postData.user.id]);
    }, [users[postData.user.id]]);

    return (
        <Card variant="outlined" sx={{ mb: 0.5 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <PlayButton post={postData} user={user} variant="icon" />
                <UserAvatar url={user?.avatarURL} username={user?.username} width={32} height={32} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Link
                        component={RouterLink}
                        to={`/post/${postData.id}`}
                        underline="hover"
                        color="inherit"
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        sx={{ display: 'block' }}
                    >
                        {postData.title}
                    </Link>
                    <Stack direction="row" gap={0.5} alignItems="center">
                        <Link component={RouterLink} to={`/${postData.user.path}`} underline="hover" variant="caption" color="text.secondary" noWrap>
                            {user?.username}
                        </Link>
                        <Typography variant="caption" color="text.secondary">·</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {inTime(postData.creationTime)}
                        </Typography>
                        {postData.category?.id && (
                            <>
                                <Typography variant="caption" color="text.secondary">·</Typography>
                                <Chip
                                    component={RouterLink}
                                    to={`/categories/${postData.category.id}`}
                                    label={postData.category.id}
                                    size="small"
                                    variant="outlined"
                                    clickable
                                    sx={{ height: 18, fontSize: 10 }}
                                />
                            </>
                        )}
                    </Stack>
                </Box>
                <Stack direction="row" gap={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
                    <LikeButton postId={postData.id} initialCount={postData.likes || 0} postOwnerId={postData.user?.id} />
                    <BookmarkButton postId={postData.id} />
                    <Stack direction="row" gap={0.25} alignItems="center">
                        <Comment sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {(postData?.commentCount || postData?.comment?.length || 0).toLocaleString(window.navigator.language, { notation: 'compact' })}
                        </Typography>
                    </Stack>
                    <Stack direction="row" gap={0.25} alignItems="center">
                        <BarChart sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {(postData?.plays || 0).toLocaleString(window.navigator.language, { notation: 'compact' })}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
