import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { daysAgo, getReproductions, stringToDate } from "../utils/utils";
import Username from "./Username";

export default function PostElement({postData,postId,setPlay,username}){
    const [reproduction,setReproduction] = useState();
    const handleClick = ()=>{
        setPlay({...postData,...{postId}});
    }
    useEffect(()=>{
        const reproductions = async ()=>{
            setReproduction(await getReproductions(postId));
        }
        reproductions();
    },[]);
    return(
        <div className="rounded w-full p-2 dark:text-white border">
            <div className="flex flex-row gap-x-2 items-end">
                <div className="text-2xl cursor-pointer" onClick={handleClick} >
                    {postData.title}
                </div>
                {postData.nsfw?<p className={`font-bold text-red-600 outline outline-2 outline-red-700 rounded text-xs h-fit p-1`}>NSFW</p>:''}
                <div className="flex-1 w-full flex gap-x-1 text-md dark:text-white/40">
                    <Username id={postData.userId} className="hover:underline dark:hover:text-white/90">{username}</Username>
                </div>
                <p className="text-xs bg-purple-700 rounded p-1 text-white h-fit" title={stringToDate(postData?.date.seconds)} >{daysAgo(postData?.date)}</p>
            </div>
            <Link to={`/post/${postId}`} className={`truncate block`}>{postData.desc}</Link>
            {username?<p className="text-xs my-1">Reproductions: {(reproduction>10000)?((reproduction/1000).toFixed(0))+"k":reproduction?reproduction:0}</p>:""}
        </div>
    );
}