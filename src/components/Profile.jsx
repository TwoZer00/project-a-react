import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectA from "../img/projectA.svg";
import { Element } from "./elements/Element";
import { getProfileImageURL, getUserFollowers, getUserInfo, getUserPosts, setUserFollow, stringToDate } from "../utils/utils";
import { FollowerCounter } from "./elements/FollowersCounter";

export function Profile({img,user,player}){
    //console.warn(user);
    let { userId } = useParams();
    const [pimg,setPImg] = useState(img);
    const [userInfo,setUserInfo] = useState();
    const [userPosts,setUserPosts] = useState();
    const [userLogged,setUserLogged] = useState();
    const [isSendingFollow,setIsSendingFollow] = useState(false);
    const [isFollowing,setIsFollowing] = useState(false);
    const [followers,setFollowers] = useState();
    const [isLoading,setIsLoading] = useState(true);
    //console.info(userInfo);
    //commet
    const numToGender = (num)=>{
        // 0 female - 1 male - 2 no specify
        switch (num) {
            case 0:
                return "Female";
            case 1:
                return "Male";
            default:
                return "No specify";
        }
    }
    const handleClickFollow = async()=>{
        setIsSendingFollow(true)
        try {
            console.log(userInfo,(followers.length));
            let followersTemp = await setUserFollow(userInfo,user.userId,followers);
            // //setUserInfo({...followersTemp,...userInfo});
            setFollowers(followersTemp);
            setIsSendingFollow(false)
            // //let followers=userInfo.followers;
            // console.log(followersTemp);
            //console.log("action performed");
        } catch (error) {
            console.error(error.message);
            setIsSendingFollow(false)
        }
    }
    useEffect(()=>{
        const fetchData = async(id)=>{
            setPImg(await getProfileImageURL(id));
            setFollowers(await getUserFollowers(id));
            setUserInfo(await getUserInfo(id));
            setUserPosts(await getUserPosts(id,user));
            setIsLoading(false);
        }
        fetchData(userId);
    },[user, userId]);
    if(userInfo){
        return(
            <div className="mx-2 mt-2">
                 <div className="flex flex-col lg:flex-row w-full lg:w-5/6 lg:mx-auto gap-2">
                 <div className="flex-auto w-full lg:w-1/4 border rounded text-center dark:text-white">
                     <div className="bg-purple-50 dark:bg-neutral-700 h-42 border-b relative p-2">
                         <div className="overflow-hidden rounded-full h-32 w-32 block mx-auto">
                             <img src={pimg||projectA} alt="" className={`w-full object-cover h-full drop-shadow-xl ${pimg?"":"p-4"}`} />
                         </div>
                         <div className="absolute top-0 right-0 h-fit w-fit p-2 dark:text-white" title="Followers">
                             <FollowerCounter count={followers?.length} />
                         </div>
                         {user?.userId===userInfo.userId?'':<button className={`bg-purple-700 dark:bg-purple-900 h-8 text-white mt-4 px-2 rounded-full hover:outline outline-purple-700 disabled:bg-purple-300 disabled:outline-0 disabled:cursor-not-allowed ${isSendingFollow?'animate-pulse':''}`} onClick={handleClickFollow} disabled={(user?.userId===userInfo?.userId)?true:false}>{followers?.includes(user?.userId)?'Following':'Follow'}</button>}
                         {/* <button className="bg-purple-500 h-8 text-white mt-4 px-2 rounded-full hover:outline outline-purple-700" onClick={handleClickFollow}>Follow</button> */}
                     </div>
                     <h1 className="text-2xl">{userInfo?.username}</h1>
                     <p>{stringToDate(userInfo?.creationTime)}</p>
                     <p className="italic">{numToGender(userInfo?.gender)}</p>
                     <p>{userInfo?.desc}</p>
                 </div>
                 <div className="flex-auto w-full lg:w-3/4 border rounded mb-[7rem]">
                     <div className="flex flex-col devide-y h-full">
                         {
                             userPosts.size>0?userPosts?.map((doc)=><Element key={doc.id} post={doc.data()} id={doc.id} isLoading={isLoading} play={player} view={'profile'} ></Element>): <div className="dark:text-white block text-center">This user had no post</div>
                         }
                     </div>
                 </div>
             </div>
            </div>
         )
    }
}