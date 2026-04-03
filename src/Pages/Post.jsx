import { Box, Chip, IconButton, Link, Snackbar, Stack, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLoaderData, useOutletContext, useSearchParams } from 'react-router-dom';
import { Share } from '@mui/icons-material';
import InputComment from '../components/Comments/InputComment';
import List from '../components/Comments/List';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import PlayButton from '../components/PlayButton';
import StationCard from '../components/StationCard';
import Waveform from '../components/Waveform';
import UserAvatar from '../components/UserAvatar';
import VisibilityIcon from '../components/VisibilityIcon';
import { getAudioUrl, getUserData } from '../firebase/utills';
import { capitalizeFirstLetter, labels, windowLang } from '../utils';
import dayjs from 'dayjs';


export default function Post() {
    const [initData, setInitData] = useOutletContext();
    const [user, setUser] = useState();
    const postData = useLoaderData();
    const [audioUrl, setAudioUrl] = useState(null);
    const [commentList, setCommentList] = useState();
    const [copied, setCopied] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [refreshReplies, setRefreshReplies] = useState(0);
    let [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const loadUser = async (id) => {
            const data = await getUserData(id);
            setUser(data);
        }
        if (postData.user) {
            loadUser(postData.user.id);
        }
        const temp = { ...initData }
        temp.main = { title: capitalizeFirstLetter(postData.title) }
        setInitData(temp)
        setCommentList(postData?.comment || []);
        getAudioUrl(postData.filePath).then(setAudioUrl);
    }, [])
    return (
        <Stack direction={"column"} gap={1}>
            <Link component={RouterLink} to={`/categories/${postData.category.id}`} underline='hover' variant='body1' textTransform={"uppercase"} >
                {postData.category.id}
            </Link>
            <Stack direction={"row"} gap={1} alignItems={"center"}>
                <Box sx={{ width: "100%" }}>
                    <Stack direction={'row'} alignItems={'end'} gap={2}>
                        <Typography variant="h1" component="h1" sx={{ wordBreak: "break-all", fontSize: '2.5rem', fontWeight: 'bold',  ":first-letter": { textTransform: "capitalize" } }}>
                            {postData.title}
                        </Typography>
                    </Stack>
                    <Typography variant='body'>
                        {labels[windowLang]['plays']}: {(postData?.plays).toLocaleString(window.navigator.language, { style: "decimal" })}
                    </Typography>
                </Box>
                <Stack gap={1} alignItems={'center'} direction="row">
                    <Tooltip title={labels[windowLang]['share']}>
                        <IconButton size="small" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                        }}>
                            <Share fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <VisibilityIcon visibility={postData.visibility} fontSize="small" />
                    {postData.nsfw && <Tooltip title={labels[windowLang]['nsfw-alt']} ><Chip clickable variant='outlined' size='small' color='error' label={labels[windowLang]['nsfw']} /></Tooltip>}
                </Stack>
            </Stack>
            <Stack direction={"row"} gap={1} alignItems={"flex-end"}>
                <UserAvatar username={user?.username} url={user?.avatarURL} width={40} height={40} />
                <Stack direction={"column"}>
                    <Link component={RouterLink} to={`/user/${user?.id}`} underline='hover' variant='caption' >{user?.username}</Link>
                    <Typography sx={{":first-letter":{textTransform:'uppercase'}}} variant='caption'>
                        {dayjs(postData.creationTime.seconds * 1000).locale(windowLang).format("dddd DD MMMM  YYYY, h:mm:ss a")}
                    </Typography>
                </Stack>
            </Stack>
            <Stack direction={"row"} gap={1} maxWidth={"100%"} flexWrap={'wrap'}>
                {postData?.tags?.map(tag => <Chip component={RouterLink} to={`/${tag.path}`} clickable key={tag.id} label={decodeURIComponent(tag.id)} variant="outlined" size="small" />)}
            </Stack>
            <Typography variant="body1">{postData.desc}</Typography>
            {user && (
                <Stack direction="row" gap={1} alignItems="center">
                    <PlayButton post={postData} user={user} />
                    <LikeButton postId={postData.id} initialCount={postData.likes || 0} />
                    <BookmarkButton postId={postData.id} />
                    <Box sx={{ flex: 1 }}>
                        <Waveform
                            audioUrl={audioUrl}
                            progress={initData?.postInPlay?.id === postData.id ? (initData.postInPlay.progress || 0) : 0}
                            onSeek={initData?.postInPlay?.id === postData.id ? (pct) => {
                                setInitData((val) => ({
                                    ...val,
                                    postInPlay: { ...val.postInPlay, seekTo: pct }
                                }));
                            } : undefined}
                        />
                    </Box>
                </Stack>
            )}
            <Box paddingY={2}>
                <InputComment
                    post={postData}
                    setCommentList={setCommentList}
                    replyTo={replyTo}
                    onCancelReply={() => setReplyTo(null)}
                    onReplySent={() => setRefreshReplies(v => v + 1)}
                />
            </Box>
            <Box>
                <List
                    commentsList={commentList}
                    comment={searchParams.get("comment")}
                    postAuthorId={postData.user.id}
                    onReply={(id, username) => setReplyTo({ id, username })}
                    refreshReplies={refreshReplies}
                />
            </Box>
            {user && (
                <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>📻 {labels[windowLang]['more-from']} {user.username}</Typography>
                    <StationCard userId={postData.user.id} />
                </Box>
            )}
            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message={labels[windowLang]['link-copied']} />
        </Stack>
    )
}
