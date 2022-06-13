import { Link } from "react-router-dom";
import { daysAgo } from "../utils/utils";
import Username from "./Username";

export default function PostElement({postData,postId,setPlay,username}){
    const handleClick = ()=>{
        setPlay(postData);
    }
    return(
        <div className="rounded w-full p-2 dark:text-white border">
            {/* <Link to={`/user/${postData.userId}`} className={`mr-2 inline underline ${isUsernameLoading?'bg-purple-100 w-32':''}`}>{profileUsername?profileUsername:username}</Link> */}
            <div className="flex flex-row gap-x-1">
                <div className="flex-1 w-full flex gap-x-1">
                    <Username id={postData.userId} className="">{username}</Username>
                </div>
                <p className="text-xs bg-purple-700 rounded p-1 text-white">{daysAgo(postData?.date)}</p>
            </div>
            <div className="flex items-center gap-x-2">
                <div className="text-2xl cursor-pointer" onClick={handleClick} >
                    {postData.title}
                </div>
                {postData.nsfw?<p className={`font-bold text-red-600 outline outline-2 outline-red-700 rounded text-xs h-fit p-1`}>NSFW</p>:''}
            </div>
            <Link to={`/post/${postId}`} className={`truncate block`}>{postData.desc}</Link>
        </div>
    );
}