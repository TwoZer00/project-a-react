import { PauseOutlined, PlayArrowOutlined, SkipNextOutlined, SkipPreviousOutlined } from '@mui/icons-material';
import { Box, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { getAvatarImage, getUserData, setPlay } from '../firebase/utills';
import AudioCover from './AudioCover';

export default function PlayerInDrawer({ open, audio, data }) {
    const [initData, setInitData] = data;
    const audioRef = useRef();
    const [audioProgress, setAudioProgress] = useState(0);
    const [progressTime, setProgressTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [username, setUsername] = useState();
    const [played, setPlayed] = useState(false);
    const [user, setUser] = useState();
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
        updatePositionState();
        if (getCurrentPorcentage() > 30) setPlayed(true);
    }
    const handleEnded = () => {
        setIsPlaying(false);
        setPlayed(false);
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
    const handleLoaded = async () => {
        const duration = audioRef.current.duration;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
        setProgressTime(audioRef.current.currentTime);
        setInitData((value) => {
            const temp = { ...value }
            if (temp?.postInPlay) {
                temp.postInPlay.isAudioInProgress = [true];
            }
            let history = [];
            if (temp.history) history = [...temp.history]
            history.unshift(audio);
            temp.history = history;
            return temp;
        })
        if ("mediaSession" in navigator) {
            const cover = await getAvatarImage(user?.avatarURL || audio?.cover);
            navigator.mediaSession.metadata = new MediaMetadata({
                title: `${audio?.title}`,
                artist: audio?.username,
                artwork: [{
                    src: `${cover}`,
                    sizes: "96x96",
                    type: "image/png",
                }],
            });
        }

    }
    useEffect(() => {
        if (initData?.postInPlay?.isAudioInProgress[1]) {
            handlePlay()
        }
    }, [initData?.postInPlay?.isAudioInProgress[1]]);

    navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current.play();
        setIsPlaying((val) => {
            return !val
        });
        setInitData((value) => {
            const temp = { ...value }
            if (temp?.postInPlay) {
                temp.postInPlay.isAudioInProgress = [true];
            }
            return temp;
        })
    });
    navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current.pause();
        setIsPlaying((val) => {
            return !val
        });
        setInitData((value) => {
            const temp = { ...value }
            if (temp?.postInPlay) {
                temp.postInPlay.isAudioInProgress = [false];
            }
            return temp;
        })
    });

    const getCurrentPorcentage = () => {
        return (((100 * audioRef.current.currentTime) / audioRef.current.duration));
    }
    useEffect(() => {
        const fetchPlay = async () => {
            const temp = await setPlay(audio?.id);
        }
        if (played) {
            fetchPlay();
        }
    }, [played])
    function updatePositionState() {
        navigator.mediaSession.setPositionState({
            duration: audioRef.current.duration,
            playbackRate: audioRef.current.playbackRate,
            position: audioRef.current.currentTime,
        });
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const temp = await getUserData(audio?.userId);
            setUser(temp);
        }
        if (audio?.userId) {
            fetchUserData();
        }
    }, [audio]);

    const toHHMMSS = (secs) => {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num % 3600) / 60);
        const seconds = sec_num % 60;

        const formatValue = (value) => (value < 10 ? `0${value}` : value);

        const timeArray = [hours, minutes, seconds].map(formatValue);

        return timeArray.filter((v, i) => v !== "00" || i > 0).join(":");
    };
    const handleClick = (e) => {
        let start = 0;
        if (e.clientX > 15) {
            start = e.clientX - 15;
        }
        const eq = (start * e.target.clientWidth) / (222 - 15);
        const eqTime = (eq * audioRef.current.duration) / (222 - 15);
        const eqPorcentage = ((eq * 100) / (222 - 15))
        audioRef.current.currentTime = Math.round(eqTime);
        setAudioProgress(eqPorcentage);
    }
    return (
        <Stack direction="column" width={"100%"} sx={{ placeSelf: "end" }} gap={1}>
            <div>
                {(open && audio?.coverUrl || audio?.cover) && <AudioCover url={audio?.coverUrl || audio?.cover} />}
                {open && <Typography textAlign={"center"} fontSize={"16px"} textOverflow={"ellipsis"} overflow={"hidden"}>{audio?.title}</Typography>}
                {open && <Typography textAlign={"center"} fontSize={"12px"}>{audio?.username}</Typography>}
            </div>
            {open && (
                <Box>
                    <LinearProgress variant="determinate" value={audioProgress} color='secondary' sx={{ width: "100%" }} style={{ borderRadius: "1rem" }} onClick={handleClick} />
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
                    <IconButton disabled>
                        <SkipPreviousOutlined />
                    </IconButton>
                }
                <IconButton onClick={handlePlay} disabled={!audio} >
                    {
                        initData?.postInPlay?.isAudioInProgress[0] && audio.id === initData?.postInPlay?.id ?
                            <PauseOutlined /> :
                            <PlayArrowOutlined />
                    }
                </IconButton>
                {
                    open &&
                    <IconButton disabled>
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
