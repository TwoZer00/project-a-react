import { Card, CardContent, CardHeader, Chip, Collapse, IconButton, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ExpandMore, ExpandLess, Reply } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getComment, getReplies, getUserData } from '../../firebase/utills';
import { labels, windowLang } from '../../utils';
import UserAvatar from '../UserAvatar';
dayjs.extend(duration)
dayjs.extend(relativeTime)

export default function Comment({ id, postAuthorId, onReply, isReply, replyData, refreshReplies, defaultShowReplies }) {
    const [comment, setComment] = useState()
    const [user, setUser] = useState();
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(defaultShowReplies || false);

    useEffect(() => {
        const fetchData = async () => {
            const data = replyData || await getComment(id);
            if (!data) return;
            data.creationTime = inTime(data.creationTime);
            const userData = await getUserData(data.user.id);
            setUser(userData);
            setComment(data);
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (isReply) return;
        const fetchReplies = async () => {
            const replyList = await getReplies(id);
            setReplies(replyList);
            if (replyList.length > replies.length && replies.length > 0) setShowReplies(true);
            if (defaultShowReplies && replyList.length > 0) {
                setShowReplies(true);
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else if (defaultShowReplies) {
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        };
        fetchReplies();
    }, [id, refreshReplies]);

    const isAuthor = comment?.user?.id === postAuthorId;

    return (
        <>
            <Card
                variant={isReply ? 'elevation' : 'outlined'}
                elevation={isReply ? 0 : undefined}
                id={id}
                sx={isReply ? {
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                } : {}}
            >
                <CardHeader
                    avatar={
                        <UserAvatar url={user?.avatarURL} username={user?.username} width={isReply ? 28 : 40} height={isReply ? 28 : 40} />
                    }
                    title={
                        <Stack direction={"row"} gap={1} alignItems="center">
                            <Link component={RouterLink} underline='hover' to={`/user/${comment?.user.id}`} variant={isReply ? 'caption' : 'body1'}>{user?.username}</Link>
                            {isAuthor && <Chip label={labels[windowLang]['post-author']} size='small' color='primary' variant='outlined' sx={{ height: 20, fontSize: 11 }} />}
                        </Stack>
                    }
                    subheader={<Link variant="caption" component={RouterLink} to={`?comment=${id}`} underline='hover' color={"inherit"} sx={{ fontSize: isReply ? 11 : 12 }}>{comment?.creationTime}</Link>}
                    action={onReply && (
                        <IconButton size="small" onClick={() => onReply(id, user?.username)}>
                            <Reply fontSize="small" />
                        </IconButton>
                    )}
                    sx={isReply ? { pb: 0, pt: 1 } : {}}
                />
                <CardContent sx={isReply ? { pt: 0, pb: '8px !important' } : {}}>
                    <Typography variant={isReply ? 'body2' : 'body1'}>{comment?.content}</Typography>
                </CardContent>
            </Card>
            {replies.length > 0 && !isReply && (
                <Stack sx={{ ml: 3, borderLeft: 2, borderColor: 'primary.main', pl: 1.5 }}>
                    <IconButton
                        size="small"
                        onClick={() => setShowReplies(v => !v)}
                        sx={{ alignSelf: 'flex-start', gap: 0.5, borderRadius: 1, fontSize: 13, color: 'text.secondary' }}
                    >
                        {showReplies ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </IconButton>
                    <Collapse in={showReplies}>
                        <Stack direction="column" gap={1} sx={{ mt: 1 }}>
                            {replies.map(reply => (
                                <Comment
                                    key={reply.id}
                                    id={reply.id}
                                    replyData={reply}
                                    postAuthorId={postAuthorId}
                                    onReply={onReply}
                                    isReply
                                />
                            ))}
                        </Stack>
                    </Collapse>
                </Stack>
            )}
        </>
    )
}

export const inTime = (date) => {
    const now = dayjs(new Date())
    const created = dayjs(new Date(date.seconds * 1000))
    const diff = dayjs.duration(created.diff(now)).locale(windowLang)
    return diff.humanize(true)
}
