import { Person, Person2, Person4, Radio } from '@mui/icons-material';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ButtonFollow from '../components/Follow/Button';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import UserAvatar from '../components/UserAvatar';
import { getAudioUrl, getAvatarImage, getUserData, getPostsUser } from '../firebase/utills';
import { labels, windowLang } from '../utils';

export default function Profile() {
    const { id } = useParams();
    const [userData, setUserData] = useState();
    const [initData, setInitData] = useOutletContext();
    useEffect(() => {
        const temp = { ...initData }
        const loadUserData = async (userId) => {
            const data = await getUserData(userId);
            if (data.avatarURL) {
                try { data.avatarURL = await getAvatarImage(data.avatarURL); } catch (e) { console.error(e); }
            }
            setUserData(data);
            temp.main = { title: `${data.username}'s ${labels[windowLang]['profile']}` };
            setInitData(temp);
        }
        if (id) {
            loadUserData(id)
        }
        else if (!id && getAuth().currentUser) {
            loadUserData(getAuth().currentUser.uid);
        }
    }, [])
    const handleGender = (gender, fs) => {
        let genderIcon = <Person4 sx={{ fontSize: fs }} />
        switch (parseInt(gender)) {
            case 0:
                genderIcon = <Person2 sx={{ fontSize: fs }} />
                return genderIcon;
            case 1:
                genderIcon = <Person sx={{ fontSize: fs }} />
                return genderIcon;
            default:
                return genderIcon;
        }
    }
    return (
        <>
            <Stack direction={"column"} gap={1}>
                <Box sx={{
                    width: "100%",
                    height: "250px",
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    position: "relative",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "flex-end",
                    padding: 1,
                    color: "white"
                }}>
                    {userData ? (
                        <Stack direction="row" spacing={2} alignItems={"flex-end"}>
                            <UserAvatar url={userData?.avatarURL} username={userData?.username} width={100} height={100} />
                            <Stack direction={"column"}>
                                <Typography variant="h1" fontSize={24} fontWeight={400}>{userData?.username}</Typography>
                                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                    <Typography variant="subtitle">{handleGender(userData?.gender, 14)}</Typography>
                                    <Typography variant="subtitle" fontSize={12}>{labels[windowLang]["user-since"]} {dayjs(new Date(userData?.creationTime.seconds ? userData?.creationTime.seconds * 1000 : userData?.creationTime)).locale(windowLang).format("MMMM DD YYYY")}</Typography>
                                </Stack>
                                <Typography variant="subtitle1" fontSize={12} sx={{ ":first-letter": { textTransform: "capitalize" } }} >{userData?.description}</Typography>
                                <Typography variant="body" fontSize={12}>{labels[windowLang]['followers']} {userData?.followers?.length || 0}</Typography>
                                <ButtonFollow type="text" userId={getAuth().currentUser?.uid} followerId={id} setFData={setUserData} />
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={2} alignItems="flex-end">
                            <Skeleton variant="circular" width={100} height={100} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                            <Stack direction="column" gap={0.5}>
                                <Skeleton width={150} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                <Skeleton width={200} height={16} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                <Skeleton width={120} height={16} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                            </Stack>
                        </Stack>
                    )}
                </Box>
                <Typography variant="subtitle">{userData?.desc}</Typography>
                <StationButton userId={id || getAuth().currentUser?.uid} username={userData?.username} />
                <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}>
                    <PostList userId={id || getAuth().currentUser?.uid} />
                </Box>
            </Stack>
        </>
    )
}

function StationButton({ userId, username }) {
    const [initData, setInitData] = useOutletContext();
    const [loading, setLoading] = useState(false);

    const handlePlayStation = async () => {
        setLoading(true);
        const posts = await getPostsUser(userId);
        const publicPosts = posts.filter(p => p.visibility === 'public');
        if (publicPosts.length === 0) {
            setLoading(false);
            return;
        }
        // Shuffle for variety
        for (let i = publicPosts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [publicPosts[i], publicPosts[j]] = [publicPosts[j], publicPosts[i]];
        }
        const first = publicPosts[0];
        const url = await getAudioUrl(first.filePath);
        const userData = await getUserData(first.user.id);
        setInitData((val) => ({
            ...val,
            postInPlay: {
                title: first.title,
                desc: first.desc,
                id: first.id,
                userId: first.user.id,
                isAudioInProgress: [false],
                audioUrl: url,
                username: userData.username,
                cover: first.coverURL || userData.avatarURL
            },
            station: {
                name: `${username}'s station`,
                queue: publicPosts,
                currentIndex: 0
            }
        }));
        setLoading(false);
    }

    const isStationPlaying = initData?.station?.name === `${username}'s station`;

    return (
        <Button
            variant={isStationPlaying ? "contained" : "outlined"}
            size="small"
            startIcon={<Radio />}
            onClick={handlePlayStation}
            disabled={loading}
            sx={{ alignSelf: 'flex-start' }}
        >
            {isStationPlaying ? 'Station playing' : `Play ${username}'s station`}
        </Button>
    );
}

function PostList({ userId }) {
    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const isOwner = userId === getAuth().currentUser?.uid;
    useEffect(() => {
        const loadPosts = async () => {
            const posts = await getPostsUser(userId);
            const filtered = !isOwner
                ? posts.filter(p => p.visibility === 'public')
                : posts;
            setPosts(filtered);
            setLoaded(true);
        }
        loadPosts();
    }, [])
    return (
        <>
            {posts.length > 0
                ? posts.map((post) => <PostCard key={post.id} postData={post} />)
                : loaded && <EmptyState
                    icon="🎶"
                    message={labels[windowLang]['no-posts'] || 'No posts yet'}
                    actionLabel={isOwner ? (labels[windowLang]['upload'] || 'Upload your first audio') : undefined}
                    actionTo={isOwner ? '/upload' : undefined}
                />
            }
        </>
    )
}