import React, { useEffect, useState } from 'react'
import { useLoaderData, useOutletContext, Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography'
import { getUserData } from '../firebase/utills';
import { Chip, Link, Stack, capitalize } from '@mui/material';
import VisibilityIcon from '../components/VisibilityIcon';
import PlayButton from '../components/PlayButton';
import UserCard from '../components/UserCard';
import UserAvatar from '../components/UserAvatar';


export default function Post() {
    const [initData, setInitData] = useOutletContext();
    const [user, setUser] = useState();
    const postData = useLoaderData();

    useEffect(() => {
        const loadUser = async (id) => {
            const data = await getUserData(id);
            setUser(data);
        }
        if (postData.user) {
            loadUser(postData.user);
        }
        const temp = { ...initData }
        temp.main = { title: postData.title }
        setInitData(temp)
    }, [])
    return (
        <Stack direction={"column"} gap={1}>
            {/* <Stack direction={"row"} >
                <Link component={RouterLink} to={`/user/${user?.id}`} underline='hover' variant='caption' >{user?.username}</Link>
            </Stack> */}
            <Typography variant="body1" fontSize={16} textTransform={"capitalize"} >{postData.genre.id}</Typography>
            <Stack direction={"row"} gap={1}>
                <Typography variant="h1" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', width: "100%", ":first-letter": { textTransform: "capitalize" } }}>
                    {postData.title}
                </Typography>
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
                {postData.tags.map(tag => <Chip component={RouterLink} to={`/${tag.path}`} clickable key={tag.id} label={decodeURIComponent(tag.id)} variant="outlined" size="small" />)}
            </Stack>
            <Typography variant="body1">{postData.desc}</Typography>
            <PlayButton post={postData} user={user} />
        </Stack>
    )
}