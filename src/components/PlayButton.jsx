import { useEffect, useState } from 'react'
import { Button, IconButton } from '@mui/material'
import React from 'react'
import { useOutletContext } from 'react-router-dom';
import { getAudioUrl } from '../firebase/utills';
import { Pause, PlayArrow } from '@mui/icons-material';

export default function PlayButton(props) {
    const [initData, setInitData] = useOutletContext();
    const audioPath = props.post.filePath;
    const { id } = props.post;
    // console.log(audioPath);
    const handleClick = async () => {
        // console.log(audioPath);
        if (initData?.postInPlay?.isAudioInProgress && id === initData.postInPlay.id) {
            const temp = { ...initData }
            temp.postInPlay.isAudioInProgress = [false, "change"]
            setInitData(temp);
        }
        else {
            const url = await getAudioUrl(audioPath);
            const postInPlay = {
                title: props.post.title,
                desc: props.post.desc,
                id: props.post.id,
                userId: props.user.id,
                isAudioInProgress: [false],
                audioUrl: url,
                username: props.user.username,
                cover: props.post.coverURL || props.user.avatarURL
            }
            const temp = { ...initData, postInPlay }
            setInitData(temp);
        }
    }

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (initData?.postInPlay?.isAudioInProgress[0] && id === initData.postInPlay.id) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [initData?.postInPlay?.isAudioInProgress]);

    if (props.variant === 'icon') {
        return (
            <>
                <IconButton onClick={handleClick} >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
            </>
        )
    }
    else {
        return (
            <>
                <Button variant="contained" color="primary" size="small" onClick={handleClick}>{isPlaying ? "pause" : "play"}</Button>
            </>
        )
    }
}
