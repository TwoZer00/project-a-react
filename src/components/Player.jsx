import { PlayIcon,ChevronDownIcon } from "@heroicons/react/solid";
import { PauseIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAudioUrl, getProfileImageURL, getUsername, pixToPorcentage, porcentageToSecs, secToPorcentage, setReproduction, stringToDate } from "../utils/utils";
import { PlayButton } from "./PlayButton";
import ProgressBar from "./Player/ProgressBar";


export function Player({post,playerDisplay,playerAction}){
    const [audio,setAudio] = useState();
    const [coverImage, setCoverImage] = useState();
    const audioElement = useRef();
    const [audioProgressTime,setAudioProgressTime] = useState(0);
    const [username,setUsername] = useState();
    const [audioState,setAudioState] = useState();
    const [isPlaying,setIsPlaying] = useState(false);
    //const postId= post.postId;
    //console.log(new Date(post.date.seconds*1000));
    const handlePlay = (e)=>{
        setIsPlaying(true);
        setAudioState("playing");
    }
    const handleAudio = (e)=>{
        audioElement.current.play();
        setReproduction(post);
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
        setAudioState("paused");
    }
    const handleHidePlayer = () => {
        playerDisplay("hidden");
    } 
    useEffect(()=>{
        const downloadAudio = async()=>{
            setAudioState("loading");
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
        downloadAudio();
        downloadCoverImage();
        if(!post?.username){
            dusername();
        }
    },[post]);
    if(post){
        return (
            <div className="dark:bg-neutral-900 h-full px-2 dark:text-white">
                <audio src={audio||''} ref={audioElement} onLoadedData={handleAudio} onPlaying={handlePlay} onTimeUpdate={handleTimeUpdate} onEnded={handleEndend}></audio>
                <div className="lg:w-5/6 lg:mx-auto h-full rounded-t bg-white dark:bg-neutral-900 border border-b-0">
                    <div className="flex flex-row gap-x-2 gap-y-1 items-center h-full">
                        <div className="flex-none w-28 h-full bg-purple-200 overflow-hidden">
                            <img src={coverImage} alt="" className="h-full object-cover w-fit" />
                        </div>
                        <div className="bg-white dark:bg-neutral-900 dark:text-white flex-auto w-4/6 lg:w-5/6 flex flex-row items-center gap-x-1 pr-2">
                            <div className="cursor-pointer h-full w-20" onClick={handleClickPlay}>
                                <PlayButton state={audioState} className="dark:fill-purple-200 fill-purple-700" />
                            </div>
                            <div className="flex flex-col flex-auto">
                                <div className="flex-auto w-full flex">
                                    <Link className="flex-1 hover:underline" to={`/user/${post.userId}`}>{post.username||username}</Link>
                                    <p className="bg-purple-700 text-white rounded px-1 h-fit">{stringToDate(post.date.seconds)}</p>
                                    <ChevronDownIcon className="w-6 cursor-pointer" onClick={handleHidePlayer}/>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                        <div className="flex-1 w-full flex items-center gap-x-1">
                                            {post.nsfw?<p className="h-fit w-fit font-bold text-red-600 outline outline-2 outline-red-700 rounded px-1 text-xs" >NSFW</p>:''}
                                            <p>{post.title}</p>
                                        </div>
                                    </div>
                                <div className="flex-auto w-full">
                                    {/* <ProgressBar audio={audio} state={setAudioState}/> */}
                                    <div className="w-full h-8 relative">
                                        <p className="absolute bottom-0 left-0 text-sm select-none pointer-events-none">{audioProgressTime.toString().toHHMMSS()||"00:00"}</p>
                                        <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden absolute inset-0 hover:cursor-pointer" onClick={handleProgressClick}>
                                            <div className={`transition-all pointer-events-none bg-purple-700 drop-shadow-lg relative h-full after:h-full after:w-3 after:bg-purple-100 after:rounded-full after:border-2 after:absolute after:border-purple-500 after:-right-2 after:inset-y-0 after:right-0 rounded-r-lg`} style={{width:`${Math.round(secToPorcentage(audioProgressTime,audioElement.current?.duration))}%`}}></div>
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
}