import { BarChart, Comment, PlaylistRemove, Public, PublicOff } from '@mui/icons-material'
import { Box, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import { getDoc, getFirestore } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { getUserData } from '../firebase/utills'
import { windowLang } from '../utils'
import PlayButton from './PlayButton'
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
                userId: postData.user.id,
                isAudioInProgress: [false],
                audioUrl,
                username: user.username,
                cover: postData.coverURL || user.avatarURL
            }
            const temp = { ...initData, postInPlay }
            setInitData(temp);
        }
    }
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserData(postData.user.id);
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
                                {/* {moment(new Date(postData.creationTime.seconds * 1000)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} */}
                                <Tooltip title={moment(postData.creationTime.seconds * 1000).format("dddd, MMMM Do YYYY, h:mm:ss a")}><Typography variant="body1" >{moment.duration(moment(postData.creationTime.seconds * 1000).subtract(new Date())).humanize(true)}</Typography></Tooltip>
                            </Box>
                        }
                    />
                    <CardContent sx={{ paddingY: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* {postData.nsfw && <Typography sx={{ width: "fit-content", letterSpacing: 2, fontWeight: "bolder", fontSize: "12px" }} color='error'>NSFW</Typography>} */}
                        <Link component={RouterLink} to={`/categories/${postData.category.id}`} relative='path' underline='hover' color='text.primary' fontSize='small' sx={{ textDecoration: "none" }}>{((postData.category).path).substring(postData.category.path.lastIndexOf("/") + 1)}</Link>
                        <Stack direction={"row"} gap={1} width={"100%"} maxWidth={"350px"} overflow={'auto'} sx={{ scrollBehavior: "smooth", scrollbarWidth: "thin" }} >
                            {postData?.tags?.map((tag, index) => <Chip key={index} label={decodeURIComponent((tag.path).substring(tag.path.lastIndexOf("/") + 1))} clickable size='small' variant='outlined' component={RouterLink} to={`/tags/${(tag.path).substring(tag.path.lastIndexOf("/") + 1)}`} relative='path' />)}
                        </Stack>
                        <Stack direction={"column"} gap={1} maxWidth={"100%"}>
                            <Stack direction={"column"}>
                                <Link variant="h5" component={RouterLink} to={`/post/${postData.id}`} underline='hover' color={"inherit"} flex={1}>
                                    {postData.title}
                                </Link>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" overflow={"hidden"} maxWidth={{ md: "40ch" }} maxHeight={{ sx: "300px" }} textOverflow={'ellipsis'} whiteSpace={'break-spaces'}>
                                {postData.desc}
                            </Typography>
                        </Stack>
                        {postData.nsfw && <Typography sx={{ width: "fit-content", letterSpacing: 2, fontWeight: "400", fontSize: "12px" }} color='error'>NSFW</Typography>}
                    </CardContent>
                    <CardActions sx={{ display: "flex", flexDirection: "row", gap: 2 }} >
                        <PlayButton post={postData} user={user} variant="icon" />
                        <Tooltip title={(postData?.comment?.length || [].length).toLocaleString(window.navigator.language, { style: "decimal" })}>
                            <Stack direction={"row"} gap={1}>
                                <Comment />
                                <Typography>{(postData?.comment?.length || [].length).toLocaleString(window.navigator.language, { style: "decimal", compactDisplay: "short", notation: "compact", })}</Typography>
                            </Stack>
                        </Tooltip>
                        <Tooltip title={(postData?.plays).toLocaleString(window.navigator.language, { style: "decimal" })}>
                            <Stack direction={"row"} gap={1}>
                                <BarChart />
                                <Typography>{(postData?.plays).toLocaleString(window.navigator.language, { style: "decimal", compactDisplay: "short", notation: "compact", })}</Typography>
                            </Stack>
                        </Tooltip>
                    </CardActions>
                </Card>
            </Grid >
        </>
    )
}

const formatNumber = (number) =>
    number >= 1e6
        ? (number / 1e6).toLocaleString(windowLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'M'
        : number >= 1e3
            ? (number / 1e3).toLocaleString(windowLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'k'
            : number.toLocaleString();


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