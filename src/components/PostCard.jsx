import { doc } from 'firebase/firestore'
import { getDoc, getFirestore } from 'firebase/firestore'
import { PlayArrow } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Link, Stack, Typography } from '@mui/material'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'

export default function PostCard({ postData }) {
    const [initData, setInitData] = useOutletContext();
    const [profileImgUrl, setProfileImgUrl] = useState();
    const [username, setUsername] = useState();
    const handlePlayButton = async () => {
        const audioUrl = await getAudioUrl(postData.filePath);
        const postInPlay = {
            title: postData.title,
            desc: postData.desc,
            id: postData.id,
            userId: postData.userId,
            audioUrl
        }
        const temp = { ...initData, postInPlay }
        setInitData(temp);
    }


    useEffect(() => {
        const handleProfileImage = async () => {
            const profileImgUrl = await getProfileImgUrl(postData.userId);
            setProfileImgUrl(profileImgUrl);
        }
        const handleUsername = async () => {
            const username = await getUsername(postData.user);
            setUsername(username);
        }
        handleUsername();
        handleProfileImage();

    }, [])

    return (
        <>
            <Grid item width={{ xs: "100%", md: 300 }}>
                <Card sx={{ width: "100%" }} >
                    <CardHeader title={<Link component={RouterLink} to={`/${postData.user.path}`} underline='hover'>{username}</Link>} avatar={<Avatar src={profileImgUrl} component={RouterLink} to={`/${(postData.user.path)}`} />} subheader={(new Date(postData.creationTime.seconds * 1000)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
                    <CardContent sx={{ paddingY: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                        <Link component={RouterLink} to={`/genre/${postData.genre.id}`} underline='hover' color='text.primary' fontSize='small' sx={{ textDecoration: "none" }}>{((postData.genre).path).substring(postData.genre.path.lastIndexOf("/") + 1)}</Link>
                        <Stack direction={"row"} gap={1}>
                            {postData.tags.map((tag, index) => <Chip key={index} label={(tag.path).substring(tag.path.lastIndexOf("/") + 1)} clickable size='small' variant='outlined' component={RouterLink} to={`/tag/${tag.id}`} />)}
                        </Stack>
                        <Box>
                            <Typography variant="h5" component="div" >
                                {postData.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" maxHeight={{ xs: 57, md: "fit-content" }} overflow="hidden">
                                {postData.desc}
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={handlePlayButton} >
                            <PlayArrow />
                        </IconButton>
                        <Button variant="text" size='small' color='info' component={RouterLink} to={`/post/${postData.id}`} >View</Button>
                    </CardActions>
                </Card>
            </Grid >
        </>
    )
}

async function getAudioUrl(filePath) {
    const storage = getStorage();
    const storageRef = ref(storage, `${filePath}`);
    const audioUrl = await getDownloadURL(storageRef);
    return audioUrl;
}

async function getProfileImgUrl(id) {
    const storage = getStorage();
    const storageRef = ref(storage, `userPhotos/${id}/profileImage.jpg`);
    const profileImgUrl = await getDownloadURL(storageRef);
    return profileImgUrl;
}

async function getUsername(user) {
    let username = ""
    const db = getFirestore();
    const docRef = await getDoc(user);
    username = docRef.data().username;
    return username;
}

