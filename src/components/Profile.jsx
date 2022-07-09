import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileImageURL, getProfileReproductions, getUserFollowers, getUserInfo, getUserPosts} from "../utils/utils";
import PostList from "./PostList";
import ProfileDetails from "./Profile/ProfileDetails";
import Spinner from "./Spinner";

export function Profile({img,user,player}){
    let { userId } = useParams();
    const [pimg,setPImg] = useState(img);
    const [userInfo,setUserInfo] = useState();
    const [userPosts,setUserPosts] = useState();
    const [followers,setFollowers] = useState();
    const [reproductions,setReproductions] = useState(0);
    const [isLoading,setIsLoading] = useState(true);
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
            <div className="mx-2 mt-2 h-full">
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