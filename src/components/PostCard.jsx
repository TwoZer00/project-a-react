import { PlayArrow } from '@mui/icons-material'
import { Card, CardActionArea, CardActions, CardContent, Grid, IconButton, Typography } from '@mui/material'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import React from 'react'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'

export default function PostCard({ postData }) {
    const [initData, setInitData] = useOutletContext();
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
    return (
        <>
            <Grid item >
                <Card sx={{ width: 300, flexGrow: 1 }}>
                    <CardActionArea component={RouterLink} to={`/post/${postData.id}`} >
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {postData.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {postData.desc}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <IconButton onClick={handlePlayButton} >
                            <PlayArrow />
                        </IconButton>
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}

async function getAudioUrl(filePath) {
    const storage = getStorage();
    const storageRef = ref(storage, `${filePath}`);
    const audioUrl = await getDownloadURL(storageRef);
    return audioUrl;
}

