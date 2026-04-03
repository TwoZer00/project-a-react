import React, { useEffect, useRef, useState } from 'react';
import { getAudioUrl, getAvatarImage, getInterludesByType, getUserData, setPlay } from '../firebase/utills';
import MiniPlayer from './MiniPlayer';

export default function PlayerInDrawer({ audio, data }) {
    const [initData, setInitData] = data;
    const audioRef = useRef();
    const [audioProgress, setAudioProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(false);
    const [user, setUser] = useState();

    const handlePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
            setInitData(val => ({ ...val, postInPlay: { ...val.postInPlay, isAudioInProgress: [true] } }));
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            setInitData(val => ({ ...val, postInPlay: { ...val.postInPlay, isAudioInProgress: [false] } }));
        }
    };

    const handleProgress = () => {
        const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setAudioProgress(pct);
        updatePositionState();
        if (pct > 30) setPlayed(true);
        setInitData(val => {
            const t = { ...val };
            if (t?.postInPlay) t.postInPlay.progress = pct;
            return t;
        });
    };

    const handleEnded = async () => {
        setIsPlaying(false);
        setPlayed(false);
        setAudioProgress(0);
        audioRef.current.currentTime = 0;

        const queue = initData?.station?.queue;
        const currentIndex = initData?.station?.currentIndex;
        if (queue && currentIndex !== undefined && currentIndex < queue.length - 1) {
            playFromQueue(currentIndex + 1);
            return;
        }

        if (!initData?.station && audio?.userId && !audio?.isInterlude) {
            try {
                const outros = await getInterludesByType(audio.userId, 'outro');
                const credits = await getInterludesByType(audio.userId, 'credit');
                const candidates = [...outros, ...credits];
                if (candidates.length > 0) {
                    const pick = candidates[Math.floor(Math.random() * candidates.length)];
                    const url = await getAudioUrl(pick.filePath);
                    setInitData(val => ({
                        ...val,
                        postInPlay: {
                            title: pick.title, desc: '', id: pick.id,
                            userId: audio.userId, isAudioInProgress: [false],
                            audioUrl: url, username: audio.username, isInterlude: true
                        }
                    }));
                    return;
                }
            } catch (e) { console.error(e); }
        }

        setInitData(val => {
            const temp = { ...val };
            if (temp?.postInPlay) temp.postInPlay.isAudioInProgress = [false];
            if (temp?.station) delete temp.station;
            return temp;
        });
    };

    const playFromQueue = async (index) => {
        const queue = initData?.station?.queue;
        if (!queue?.[index]) return;
        const item = queue[index];
        const url = await getAudioUrl(item.filePath);

        if (item.isInterlude) {
            setInitData(val => ({
                ...val,
                postInPlay: {
                    title: item.title, desc: '', id: item.id,
                    userId: val.station?.queue?.[0]?.user?.id || '',
                    isAudioInProgress: [false], audioUrl: url,
                    username: val.station?.name?.replace("'s station", '') || '',
                    isInterlude: true
                },
                station: { ...val.station, currentIndex: index }
            }));
        } else {
            const userData = await getUserData(item.user.id);
            setInitData(val => ({
                ...val,
                postInPlay: {
                    title: item.title, desc: item.desc, id: item.id,
                    userId: item.user.id, isAudioInProgress: [false],
                    audioUrl: url, username: userData.username,
                    cover: item.coverURL || userData.avatarURL
                },
                station: { ...val.station, currentIndex: index }
            }));
        }
    };

    const handleSkipNext = () => {
        const { queue, currentIndex } = initData?.station || {};
        if (queue && currentIndex < queue.length - 1) playFromQueue(currentIndex + 1);
    };

    const handleSkipPrev = () => {
        const { queue, currentIndex } = initData?.station || {};
        if (queue && currentIndex > 0) playFromQueue(currentIndex - 1);
    };

    const handleStopStation = () => {
        audioRef.current.pause();
        setIsPlaying(false);
        setInitData(val => {
            const temp = { ...val };
            delete temp.station;
            if (temp?.postInPlay) temp.postInPlay.isAudioInProgress = [false];
            return temp;
        });
    };

    const handleSeek = (pct) => {
        audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
        setAudioProgress(pct);
    };

    const handleLoaded = async () => {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
        setInitData(val => {
            const temp = { ...val };
            if (temp?.postInPlay) temp.postInPlay.isAudioInProgress = [true];
            let history = temp.history ? [...temp.history] : [];
            history.unshift(audio);
            temp.history = history;
            return temp;
        });
        if ("mediaSession" in navigator) {
            const cover = await getAvatarImage(user?.avatarURL || audio?.cover);
            navigator.mediaSession.metadata = new MediaMetadata({
                title: audio?.title,
                artist: audio?.username,
                artwork: [{ src: `${cover}`, sizes: "512x512", type: "image/jpeg" }],
            });
        }
    };

    useEffect(() => {
        if (initData?.postInPlay?.isAudioInProgress[1]) handlePlay();
    }, [initData?.postInPlay?.isAudioInProgress[1]]);

    useEffect(() => {
        const play = () => {
            audioRef.current.play();
            setIsPlaying(true);
            setInitData(val => ({ ...val, postInPlay: { ...val.postInPlay, isAudioInProgress: [true] } }));
        };
        const pause = () => {
            audioRef.current.pause();
            setIsPlaying(false);
            setInitData(val => ({ ...val, postInPlay: { ...val.postInPlay, isAudioInProgress: [false] } }));
        };
        navigator.mediaSession.setActionHandler("play", play);
        navigator.mediaSession.setActionHandler("pause", pause);
        return () => {
            navigator.mediaSession.setActionHandler("play", null);
            navigator.mediaSession.setActionHandler("pause", null);
        };
    }, []);

    useEffect(() => {
        if (played && audio?.id) setPlay(audio.id);
    }, [played]);

    function updatePositionState() {
        if (audioRef.current?.duration) {
            navigator.mediaSession.setPositionState({
                duration: audioRef.current.duration,
                playbackRate: audioRef.current.playbackRate,
                position: audioRef.current.currentTime,
            });
        }
    }

    useEffect(() => {
        const seekTo = initData?.postInPlay?.seekTo;
        if (seekTo !== undefined && audioRef.current?.duration) {
            handleSeek(seekTo);
            setInitData(val => {
                const temp = { ...val };
                if (temp?.postInPlay) delete temp.postInPlay.seekTo;
                return temp;
            });
        }
    }, [initData?.postInPlay?.seekTo]);

    useEffect(() => {
        if (audio?.userId) getUserData(audio.userId).then(setUser);
    }, [audio]);

    const toHHMMSS = (secs) => {
        const n = parseInt(secs, 10);
        const h = Math.floor(n / 3600);
        const m = Math.floor((n % 3600) / 60);
        const s = n % 60;
        const fmt = (v) => (v < 10 ? `0${v}` : v);
        return [h, m, s].map(fmt).filter((v, i) => v !== "00" || i > 0).join(":");
    };

    return (
        <>
            <MiniPlayer
                audio={audio}
                initData={initData}
                setInitData={setInitData}
                audioRef={audioRef}
                audioProgress={audioProgress}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onSkipNext={handleSkipNext}
                onSkipPrev={handleSkipPrev}
                onSeek={handleSeek}
                onStopStation={handleStopStation}
                playFromQueue={playFromQueue}
                toHHMMSS={toHHMMSS}
            />
            <audio src={audio?.audioUrl} hidden ref={audioRef} onTimeUpdate={handleProgress} onEnded={handleEnded} onLoadedData={handleLoaded} />
        </>
    );
}
