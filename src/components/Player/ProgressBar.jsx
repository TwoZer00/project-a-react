import { useState } from "react";
import { useRef } from "react";

export default function ProgressBar({audio,state}){
    const audioElement = useRef();
    const [audioDuration,setAudioDuration] = useState(0);
    const [currentTime,setCurrentTime] = useState(0);
    //console.log(1);
    const handleClick = ()=>{
        console.log("Clicked in progress bar")
    }
    const handleAudio = (e)=>{
        let audioLoaded = e.target;
        setAudioDuration(audioLoaded.duration);
        console.log("Audio loaded");
        audioElement.current.play();
        state("playing");
    }
    const handleTimeUpdate =(e)=>{
        setCurrentTime(audioElement.current.currentTime);
    }
    const handlePause = ()=>{
        state("paused");
    }
    return(
        <>
            <audio src={audio} onLoadedData={handleAudio} ref={audioElement} onTimeUpdate={handleTimeUpdate} onPause={handlePause}></audio>
            <div className="w-full h-8 relative">
                <p className="absolute bottom-0 left-0 text-sm select-none pointer-events-none">{currentTime.toString().toHHMMSS()}</p>
                <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden absolute inset-0 hover:cursor-pointer" onClick={handleClick}>
                    <div className={`pointer-events-none bg-purple-700 drop-shadow-lg relative h-full after:h-full after:w-3 after:bg-purple-100 after:rounded-full after:border-2 after:absolute after:border-purple-500 after:-right-2 after:inset-y-0 after:right-0 rounded-r-lg w-1/3`}></div>
                </div>
                <p className="absolute bottom-0 right-0 text-sm select-none pointer-events-none">{(audioDuration.toString().toHHMMSS())}</p>
            </div>
        </>
    );
}