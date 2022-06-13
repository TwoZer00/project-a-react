import { useEffect, useState } from "react";
import { setUserFollow } from "../../utils/utils";

export default function FollowButton({followerId,followingId,followers,setFollowers}){
    const [isSendingFollow,setIsSendingFollow] = useState(false);
    const handleFollow = async()=>{
        setIsSendingFollow(true)
        try {
            let followersTemp = await setUserFollow(followerId,followingId);
            setFollowers(followersTemp);
            setIsSendingFollow(false);
        } catch (error) {
            console.error(error.message);
            setIsSendingFollow(false)
        }
    }
    return(<button className={`bg-purple-700 dark:bg-purple-900 h-8 text-white mt-4 px-2 rounded-full hover:outline outline-purple-700 disabled:bg-purple-300 disabled:outline-0 disabled:cursor-not-allowed ${isSendingFollow?'animate-pulse':''}`} onClick={handleFollow} disabled={(followerId===followingId)}>{followers?.includes(followerId)?'Following':'Follow'}</button>);
}