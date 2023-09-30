import { PauseOutlined, PlayArrowOutlined, SkipNextOutlined, SkipPreviousOutlined } from '@mui/icons-material';
import { Box, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function PlayerInDrawer({ open, audio, data }) {
    const [initData, setInitData] = data;
    const audioRef = useRef();
    const [audioProgress, setAudioProgress] = useState(0);
    const [progressTime, setProgressTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [username, setUsername] = useState();
    const handlePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
            setInitData((value) => {
                const temp = { ...value }
                if (temp?.postInPlay) {
                    temp.postInPlay.isAudioInProgress = [true];
                }
                return temp;
            })
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            setInitData((value) => {
                const temp = { ...value }
                if (temp?.postInPlay) {
                    temp.postInPlay.isAudioInProgress = [false];
                }
                return temp;
            })
        }
    }
    const handleProgress = () => {
        const temp = audioRef.current.currentTime / audioRef.current.duration;
        setAudioProgress(temp * 100);
    }
    const handleEnded = () => {
        setIsPlaying(false);
        setAudioProgress(0);
        audioRef.current.currentTime = 0;
        setInitData((value) => {
            const temp = { ...value }
            if (temp?.postInPlay) {
                temp.postInPlay.isAudioInProgress = [false];
            }
            return temp;
        })
    }
    const handleLoaded = () => {
        const duration = audioRef.current.duration;
        setAudioProgress(0);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
        setProgressTime(audioRef.current.currentTime);
        setInitData((value) => {
            const temp = { ...value }
            if (temp?.postInPlay) {
                temp.postInPlay.isAudioInProgress = [true];
            }
            return temp;
        })
    }

    useEffect(() => {
        const loadUsername = async () => {
            const user = await fetchUsername(audio?.userId);
            console.log(user);
            setUsername(user);
        }
        if (audio) {
            loadUsername();
        }
    }, [audio?.userId])

    useEffect(() => {
        if (initData?.postInPlay?.isAudioInProgress[1]) {
            handlePlay()
        }
    }, [initData?.postInPlay?.isAudioInProgress[1]]);

    const toHHMMSS = (secs) => {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num % 3600) / 60);
        const seconds = sec_num % 60;

        const formatValue = (value) => (value < 10 ? `0${value}` : value);

        const timeArray = [hours, minutes, seconds].map(formatValue);

        return timeArray.filter((v, i) => v !== "00" || i > 0).join(":");
    };

    return (
        <Stack direction="column" width={"100%"} sx={{ placeSelf: "end" }} gap={1}>
            <div>
                {open && <Typography textAlign={"center"} fontSize={"14px"} textOverflow={"ellipsis"} overflow={"hidden"} >{audio?.title}</Typography>}
                {open && <Typography textAlign={"center"} fontSize={"10px"}>{username}</Typography>}
            </div>
            {open && (
                <Box>
                    <LinearProgress variant="determinate" value={audioProgress} color='secondary' sx={{ width: "100%" }} style={{ borderRadius: "1rem" }} />
                    <Stack direction={"row"} justifyContent={"space-between"} >
                        {/* <Typography>{audio && (audioRef.current.currentTime / 60).toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        })}</Typography>*/}
                        <Typography>{audio && toHHMMSS(audioRef.current.currentTime)}</Typography>
                        <Typography>{audio && toHHMMSS(audioRef?.current.duration)}</Typography>
                    </Stack>
                </Box>)}
            <Stack direction={open ? "row" : "column"} justifyContent={"center"} alignItems={"center"} width={"100%"} >
                {
                    open &&
                    <IconButton>
                        <SkipPreviousOutlined />
                    </IconButton>
                }
                <IconButton onClick={handlePlay} disabled={!audio} >
                    {
                        !isPlaying ?
                            <PlayArrowOutlined /> :
                            <PauseOutlined />
                    }
                </IconButton>
                {
                    open &&
                    <IconButton>
                        <SkipNextOutlined />
                    </IconButton>
                }
            </Stack>
            <audio src={audio?.audioUrl} hidden ref={audioRef} onTimeUpdate={handleProgress} onEnded={handleEnded} onLoadedData={handleLoaded} ></audio>
        </Stack>
    )
}

async function fetchUsername(userId) {
    const db = getFirestore();
    const docRef = doc(db, "user", userId)
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().username : null;
}
