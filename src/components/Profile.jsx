import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectA from "../img/projectA.svg";
import { Element } from "./elements/Element";
import { getProfileImageURL, getProfileReproductions, getUserFollowers, getUserInfo, getUserPosts, setUserFollow, stringToDate } from "../utils/utils";
import { FollowerCounter } from "./elements/FollowersCounter";
import PostList from "./PostList";
import ProfileDetails from "./Profile/ProfileDetails";
import Spinner from "./Spinner";

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
    const [reproductions,setReproductions] = useState(0);
    const [isLoading,setIsLoading] = useState(true);
    // const numToGender = (num)=>{
    //     // 0 female - 1 male - 2 no specify
    //     switch (num) {
    //         case 0:
    //             return "Female";
    //         case 1:
    //             return "Male";
    //         default:
    //             return "No specify";
    //     }
    // }
    // const handleClickFollow = async()=>{
    //     setIsSendingFollow(true)
    //     try {
    //         console.log(userInfo,(followers.length));
    //         let followersTemp = await setUserFollow(userId,user.userId);
    //         setFollowers(followersTemp);
    //         setIsSendingFollow(false);
    //     } catch (error) {
    //         console.error(error.message);
    //         setIsSendingFollow(false)
    //     }
    // }
    useEffect(()=>{
        const fetchData = async(id)=>{
            setPImg(await getProfileImageURL(id));
            setFollowers(await getUserFollowers(id));
            setUserInfo(await getUserInfo(id));
            setUserPosts(await getUserPosts(id,user));
            setIsLoading(false);
            setReproductions(await getProfileReproductions(id));
        }
        fetchData(userId);
    },[user, userId]);
    if(!isLoading){
        return(
            <div className="mx-2 h-full">
                 <div className="flex flex-col lg:flex-row w-full lg:w-5/6 lg:mx-auto gap-2 h-full">
                    <ProfileDetails userInfo={userInfo} profileImage={pimg} userLogged={user} followers={followers} reproductions={reproductions}  setFollowers={setFollowers} />                    
                    <div className="flex-auto w-full lg:w-3/4 border p-4 rounded">
                        <div className={`flex flex-col devide-y h-full gap-y-2 ${isLoading?'text-white justify-center items-center':''}`}>
                            <PostList postArray={userPosts} playerFunction={player} username={userInfo.username}/>
                        </div>
                    </div>
                </div>
            </div>
         )
    }
    else{
        return(<div className="mx-2 flex flex-col h-full justify-center items-center">
            <Spinner/>
        </div>)
    }
}