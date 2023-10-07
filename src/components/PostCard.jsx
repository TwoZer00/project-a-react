import { doc } from 'firebase/firestore'
import { getDoc, getFirestore } from 'firebase/firestore'
import { Pause, PlayArrow, PlaylistRemove, Public, PublicOff, StopRounded, Visibility } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { getUserData } from '../firebase/utills'
import UserAvatar from './UserAvatar'

export default function PostCard({ postData }) {
    const [initData, setInitData] = useOutletContext();
    const [profileImgUrl, setProfileImgUrl] = useState();
    const [username, setUsername] = useState("");
    const [user, setUser] = useState()
    const handlePlayButton = async () => {
        if (initData?.postInPlay?.isAudioInProgress && postData.id === initData.postInPlay.id) {
            const temp = { ...initData }
            temp.postInPlay.isAudioInProgress = [false, "change"]
            setInitData(temp);
        }
        else {
            const audioUrl = await getAudioUrl(postData.filePath);
            const postInPlay = {
                title: postData.title,
                desc: postData.desc,
                id: postData.id,
                userId: postData.userId,
                isAudioInProgress: [false],
                audioUrl,
                username: user.username,
                cover: postData.coverURL || user.avatarURL
            }
            const temp = { ...initData, postInPlay }
            setInitData(temp);
        }
    }

    const tagToParams = (tag) => {
        // return `/tag/=${}`;
    }

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserData(postData.user);
            setUser(userData);
        }
        fetchUser();
    }, [])
    return (
        <>
            <Grid item xs="auto" maxWidth={{ xs: "100%" }}>
                <Card>
                    <CardHeader
                        title={<Link component={RouterLink} to={`/${postData.user.path}`} underline='hover'>{user?.username}</Link>}
                        // avatar={<Avatar src={user?.avatarURL} component={RouterLink} to={`/${(postData.user.path)}`} {...stringAvatar(username)} />}
                        avatar={<UserAvatar url={user?.avatarURL} username={user?.username} />}
                        subheader={
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                                <Tooltip title={visibilityText(postData.visibility)}>
                                    <IconButton size='small' color='inherit' sx={{ padding: 0 }} >
                                        <VisibilityIcon visibility={postData.visibility} />
                                    </IconButton>
                                </Tooltip>
                                {(new Date(postData.creationTime.seconds * 1000)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </Box>
                        }
                    />
                    <CardContent sx={{ paddingY: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* {postData.nsfw && <Typography sx={{ width: "fit-content", letterSpacing: 2, fontWeight: "bolder", fontSize: "12px" }} color='error'>NSFW</Typography>} */}
                        <Link component={RouterLink} to={`/category/${postData.category.id}`} relative='path' underline='hover' color='text.primary' fontSize='small' sx={{ textDecoration: "none" }}>{((postData.category).path).substring(postData.category.path.lastIndexOf("/") + 1)}</Link>
                        <Stack direction={"row"} gap={1} width={"100%"} overflow={'auto'} >
                            {postData.tags.map((tag, index) => <Chip key={index} label={decodeURIComponent((tag.path).substring(tag.path.lastIndexOf("/") + 1))} clickable size='small' variant='outlined' component={RouterLink} to={`/tags/${(tag.path).substring(tag.path.lastIndexOf("/") + 1)}`} relative='path' />)}
                        </Stack>
                        <Stack direction={"column"} gap={1} maxWidth={"100%"}>
                            <Stack direction={"column"}>
                                <Typography variant="h5" component="div" flex={1} >
                                    {postData.title}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" overflow={"hidden"} maxWidth={{ xs: "200px", md: "40ch" }} textOverflow={'ellipsis'} whiteSpace={'break-spaces'}>
                                {postData.desc}
                            </Typography>
                        </Stack>
                        {postData.nsfw && <Typography sx={{ width: "fit-content", letterSpacing: 2, fontWeight: "400", fontSize: "12px" }} color='error'>NSFW</Typography>}
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={handlePlayButton} >
                            {initData?.postInPlay?.id === postData.id && initData?.postInPlay?.isAudioInProgress[0] ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <Button variant="text" size='small' component={RouterLink} to={`/post/${postData.id}`} >View</Button>
                    </CardActions>
                </Card>
            </Grid >
        </>
    )
}

function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name = "", size = { width: 50, height: 50 }) {
    // console.log(size);
    return {
        sx: {
            bgcolor: stringToColor(name),
            textDecoration: "none",
            textTransform: "uppercase",
            width: size?.width,
            height: size?.height,
            fontSize: size?.height / 2
        },
        children: `${name.includes(" ") ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : `${name[0]}`}`,
    };
}


async function getAudioUrl(filePath) {
    // console.log(filePath);
    const storage = getStorage();
    const storageRef = ref(storage, `${filePath}`);
    // console.log(storageRef);
    const audioUrl = await getDownloadURL(storageRef);
    return audioUrl;
}

async function getProfileImgUrl(id) {
    const storage = getStorage();
    const storageRef = ref(storage, `userPhotos/${id}/profileImage.jpg`);
    let profileImgUrl = ''
    try {
        if (id) {
            await getDownloadURL(storageRef);
        }
    } catch (error) {
        console.log(error.code);
    }
    return profileImgUrl;
}

async function getUsername(user) {
    let username = ""
    const db = getFirestore();
    const docRef = await getDoc(user);
    username = docRef.data().username;
    return username;
}


function VisibilityIcon({ visibility }) {
    switch (visibility) {
        case "private":
            return <PublicOff />
        case "unlisted":
            return <PlaylistRemove />
        default:
            return <Public />
    }
}

function visibilityText(visibility) {
    switch (visibility) {
        case "private":
            return "No one can watch the post and play the audio";
        case "unlisted":
            return "The ones with the link can watch the post and play the audio";
        default:
            return "Everyone can watch the post and play the audio";
    }
}