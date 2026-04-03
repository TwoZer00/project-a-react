import { Person, Person2, Person4 } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ButtonFollow from '../components/Follow/Button';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import { getAvatarImage, getUserData, getPostsUser } from '../firebase/utills';
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
                    <Stack direction="row" spacing={2} alignItems={"flex-end"}>
                        {<UserAvatar url={userData?.avatarURL} username={userData?.username} width={100} height={100} />}
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
                </Box>
                <Typography variant="subtitle">{userData?.desc}</Typography>
                <Box sx={{ columnCount: "auto", columnWidth: { xs: "100%", sm: "300px" } }}>
                    <PostList userId={id || getAuth().currentUser?.uid} />
                </Box>
            </Stack>
        </>
    )
}

function PostList({ userId }) {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const loadPosts = async () => {
            const posts = await getPostsUser(userId);
            // Filter private posts for non-owners
            const filtered = userId !== getAuth().currentUser?.uid
                ? posts.filter(p => p.visibility === 'public')
                : posts;
            setPosts(filtered);
        }
        loadPosts();
    }, [])
    return (
        <>
            {posts.map((post) => <PostCard key={post.id} postData={post} />)}
        </>
    )
}