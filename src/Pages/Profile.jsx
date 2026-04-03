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
import { getAudioUrl, getAvatarImage, getInterludesByType, getPostData, getUserData, getUserStations, getPostsUser } from '../firebase/utills';
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
                <StationSection userId={id || getAuth().currentUser?.uid} username={userData?.username} />
                <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}>
                    <PostList userId={id || getAuth().currentUser?.uid} />
                </Box>
            </Stack>
        </>
    )
}

function StationSection({ userId, username }) {
    const [initData, setInitData] = useOutletContext();
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        getUserStations(userId).then(setStations);
    }, [userId]);

    const playStation = async (station) => {
        setLoading(station.id);
        // Fetch full post data for each post in the station
        const postPromises = station.postIds.map(id => getPostData(id).catch(() => null));
        let tracks = (await Promise.all(postPromises)).filter(Boolean).filter(p => p.indexed && p.visibility === 'public');

        if (tracks.length === 0) { setLoading(null); return; }

        if (station.shuffle) {
            for (let i = tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
        }

        // Fetch interludes
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
        const firstUser = first.isInterlude ? { username } : await getUserData(first.user.id);

        setInitData(val => ({
            ...val,
            postInPlay: {
                title: first.title,
                desc: first.desc || '',
                id: first.id,
                userId: first.isInterlude ? userId : first.user.id,
                isAudioInProgress: [false],
                audioUrl: url,
                username: first.isInterlude ? username : firstUser.username,
                cover: first.isInterlude ? undefined : (first.coverURL || firstUser.avatarURL),
                isInterlude: first.isInterlude
            },
            station: {
                name: station.name,
                queue,
                currentIndex: 0
            }
        }));
        setLoading(null);
    };

    const playAllStation = async () => {
        setLoading('all');
        const posts = await getPostsUser(userId);
        const publicPosts = posts.filter(p => p.visibility === 'public');
        if (publicPosts.length === 0) { setLoading(null); return; }

        for (let i = publicPosts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [publicPosts[i], publicPosts[j]] = [publicPosts[j], publicPosts[i]];
        }

        const [intros, betweens, outros] = await Promise.all([
            getInterludesByType(userId, 'intro'),
            getInterludesByType(userId, 'between'),
            getInterludesByType(userId, 'outro'),
        ]);

        const queue = [];
        if (intros.length > 0) queue.push({ ...intros[Math.floor(Math.random() * intros.length)], isInterlude: true });
        publicPosts.forEach((post, i) => {
            queue.push(post);
            if (i < publicPosts.length - 1 && betweens.length > 0) {
                queue.push({ ...betweens[Math.floor(Math.random() * betweens.length)], isInterlude: true });
            }
        });
        if (outros.length > 0) queue.push({ ...outros[Math.floor(Math.random() * outros.length)], isInterlude: true });

        const first = queue[0];
        const url = await getAudioUrl(first.filePath);
        const firstUser = first.isInterlude ? { username } : await getUserData(first.user.id);

        setInitData(val => ({
            ...val,
            postInPlay: {
                title: first.title,
                desc: first.desc || '',
                id: first.id,
                userId: first.isInterlude ? userId : first.user.id,
                isAudioInProgress: [false],
                audioUrl: url,
                username: first.isInterlude ? username : firstUser.username,
                cover: first.isInterlude ? undefined : (first.coverURL || firstUser.avatarURL),
                isInterlude: first.isInterlude
            },
            station: {
                name: `${username}'s station`,
                queue,
                currentIndex: 0
            }
        }));
        setLoading(null);
    };

    return (
        <Stack gap={1}>
            <Stack direction="row" gap={1} flexWrap="wrap">
                <Button
                    variant={initData?.station?.name === `${username}'s station` ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<Radio />}
                    onClick={playAllStation}
                    disabled={loading === 'all'}
                >
                    {initData?.station?.name === `${username}'s station` ? 'Playing' : `Play all`}
                </Button>
                {stations.map(s => (
                    <Button
                        key={s.id}
                        variant={initData?.station?.name === s.name ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<Radio />}
                        onClick={() => playStation(s)}
                        disabled={loading === s.id}
                    >
                        {initData?.station?.name === s.name ? 'Playing' : s.name}
                    </Button>
                ))}
            </Stack>
        </Stack>
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