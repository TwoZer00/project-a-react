import { PlayIcon } from "@heroicons/react/solid";
import { PauseIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import { getAudioUrl, getProfileImageURL, getUsername, pixToPorcentage, porcentageToSecs, secToPorcentage, stringToDate } from "../utils/utils";
import { PlayButton } from "./PlayButton";


export function Player({post}){
    const [audio,setAudio] = useState();
    const [coverImage, setCoverImage] = useState();
    const audioElement = useRef();
    const [audioProgressTime,setAudioProgressTime] = useState(0);
    const [username,setUsername] = useState();

    const [audioState,setAudioState] = useState();
    const [isPlaying,setIsPlaying] = useState(false);
    //console.log(post);
    const handleAudio = (e)=>{
        //console.log(e.target);
        //console.log(audioElement);
        audioElement.current.play();
        setAudioState("playing")
        console.log(audioElement.current.duration);
    }
    const handleClickPlay = (e)=>{
        if(audioElement.current?.paused){
            audioElement.current.play();
            setIsPlaying(true);
            setAudioState("playing");
        }
        else{
            audioElement.current.pause();
            setIsPlaying(false);
            setAudioState("paused");
        }
        
    }
    const handleTimeUpdate = () =>{
        setAudioProgressTime(audioElement.current.currentTime)
    }
    const handleProgressClick = (e)=>{
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left; //x position within the element.
        audioElement.current.currentTime = porcentageToSecs(pixToPorcentage(Math.round(x), e.target.clientWidth),audioElement.current.duration);
        console.log(x,e.target.clientWidth,porcentageToSecs(pixToPorcentage(x, e.target.clientWidth),audioElement.current.duration).toFixed(2));
    }
    const handleEndend = ()=>{
        //audioElement.currentTime = 0;
        setAudioState("paused");
    }
    useEffect(()=>{
        const downloadAudio = async()=>{
            try {
                setAudio(await getAudioUrl(post.filePath));
            } catch (error) {
                setAudioState("paused");
            }
        }
        const downloadCoverImage = async()=>{
            setCoverImage(await getProfileImageURL(post.userId));
        }
        const dusername = async()=>{
            setUsername(await getUsername(post.userId));
        }
        setAudioState("loading");
        if(!post){
            setAudioState("paused");
        }else{
            downloadAudio();
            downloadCoverImage();
        }
        if(!post?.username){
            dusername();
        }

    },[post]);
    return (
        <div className="dark:bg-neutral-900 h-full px-2 dark:text-white">
            <audio src={audio||''} ref={audioElement} onLoadedData={handleAudio} onTimeUpdate={handleTimeUpdate} onEnded={handleEndend}></audio>
            <div className="w-5/6 mx-auto h-full rounded bg-white dark:bg-neutral-900 border border-b-0">
                <div className="flex flex-row gap-x-2 gap-y-1 items-center h-full">
                    <div className="flex-none w-fit h-full bg-purple-200 overflow-hidden">
                        <img src={coverImage} alt="" className="h-32 w-32 object-cover" />
                    </div>
                    <div className="bg-white dark:bg-neutral-900 dark:text-white flex-auto w-4/6 lg:w-5/6 flex flex-row items-center gap-x-1 pr-2">
                        <div className="flex-none cursor-pointer" onClick={handleClickPlay}>
                            <PlayButton state={audioState} className="dark:fill-purple-200 fill-purple-700" />
                        </div>
                        <div className="flex flex-col flex-1 ">
                            <div className="flex-auto w-full">
                                <p>{post.username||username}</p>
                                <div className="flex flex-row gap-2">
                                    <p>{post.title}</p>
                                    <p>{stringToDate(post.date)}</p>
                                </div>
                            </div>
                            <div className="flex-auto w-full">
                                <div className="w-full h-8 relative">
                                    <p className="absolute bottom-0 left-0 text-sm select-none pointer-events-none">{audioProgressTime.toString().toHHMMSS()||"00:00"}</p>
                                    <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden absolute inset-0 hover:cursor-pointer" onClick={handleProgressClick}>
                                        <div className={`pointer-events-none bg-purple-700 drop-shadow-lg relative h-full after:h-full after:w-3 after:bg-purple-100 after:rounded-full after:border-2 after:absolute after:border-purple-500 after:-right-2 after:inset-y-0 after:right-0`} style={{width:`${Math.round(secToPorcentage(audioProgressTime,audioElement.current?.duration))}%`}}></div>
                                    </div>
                                    <p className="absolute bottom-0 right-0 text-sm select-none pointer-events-none">{(audioElement?.current?.duration>0?audioElement?.current?.duration?.toString().toHHMMSS():'00:00')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}