import { Box, Chip, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLoaderData, useOutletContext, useSearchParams } from 'react-router-dom';
import InputComment from '../components/Comments/InputComment';
import List from '../components/Comments/List';
import PlayButton from '../components/PlayButton';
import UserAvatar from '../components/UserAvatar';
import VisibilityIcon from '../components/VisibilityIcon';
import { getUserData } from '../firebase/utills';
import { capitalizeFirstLetter } from '../utils';


export default function Post() {
    const [initData, setInitData] = useOutletContext();
    const [user, setUser] = useState();
    const postData = useLoaderData();
    const [commentList, setCommentList] = useState(postData?.comment || []);
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
    }, [])
    return (
        <Stack direction={"column"} gap={1}>
            {/* <Stack direction={"row"} >
                <Link component={RouterLink} to={`/user/${user?.id}`} underline='hover' variant='caption' >{user?.username}</Link>
            </Stack> */}
            <Link component={RouterLink} to={`/categories/${postData.category.id}`} underline='hover' variant='body1' textTransform={"uppercase"} >
                {postData.category.id}
            </Link>
            {/* <Typography variant="body1" fontSize={16} textTransform={"capitalize"} >{postData.category.id}</Typography> */}
            <Stack direction={"row"} gap={1} alignItems={"center"}>
                <Box sx={{ width: "100%" }}>
                    <Typography variant="h1" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', width: "100%", ":first-letter": { textTransform: "capitalize" } }}>
                        {postData.title}
                    </Typography>
                    <Typography variant='body'>
                        Plays: {(postData?.plays)}
                    </Typography>
                </Box>
                <VisibilityIcon visibility={postData.visibility} fontSize="small" />
            </Stack>
            <Stack direction={"row"} gap={1} alignItems={"flex-end"}>
                <UserAvatar username={user?.username} url={user?.avatarURL} width={40} height={40} />
                <Stack direction={"column"}>
                    <Link component={RouterLink} to={`/user/${user?.id}`} underline='hover' variant='caption' >{user?.username}</Link>
                    <Typography variant='caption'>
                        {new Date(postData.creationTime.seconds * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "numeric", hour12: false })}
                    </Typography>
                </Stack>
            </Stack>
            <Stack direction={"row"} gap={1}>
                {postData?.tags?.map(tag => <Chip component={RouterLink} to={`/${tag.path}`} clickable key={tag.id} label={decodeURIComponent(tag.id)} variant="outlined" size="small" />)}
            </Stack>
            <Typography variant="body1">{postData.desc}</Typography>
            <PlayButton post={postData} user={user} />
            <Box paddingY={2}>
                <InputComment post={postData} setCommentList={setCommentList} />
            </Box>
            <Box>
                <List commentsList={commentList} comment={searchParams.get("comment")} />
            </Box>
        </Stack>
    )
}
