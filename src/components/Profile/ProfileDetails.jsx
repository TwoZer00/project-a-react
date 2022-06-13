import { useEffect, useState } from "react";
import { numToGender, stringToDate } from "../../utils/utils";
import { FollowerCounter } from "../elements/FollowersCounter";
import projectA from "../../img/projectA.svg"
import FollowButton from "./FollowButton";

export default function ProfileDetails({userInfo,profileImage,userLogged,followers,setFollowers}){
    //const [followers,setFollowers] = useState();
    return(
        <div className="flex-auto w-full lg:w-1/4 border rounded text-center dark:text-white">
                        <div className="bg-purple-50 dark:bg-neutral-700 h-42 border-b relative p-2">
                            <div className="overflow-hidden rounded-full h-32 w-32 block mx-auto">
                                <img src={profileImage||projectA} alt="" className={`w-full object-cover h-full drop-shadow-xl ${profileImage?"":"p-4"}`} />
                            </div>
                            <div className="absolute top-0 right-0 h-fit w-fit p-2 dark:text-white" title="Followers">
                                <FollowerCounter count={followers?.length} />
                            </div>
                            {userLogged?.userId===userInfo.userId?'':<FollowButton followerId={userLogged?.userId} followingId={userInfo.userId} followers={followers} setFollowers={setFollowers} />}
                            {/* <button className="bg-purple-500 h-8 text-white mt-4 px-2 rounded-full hover:outline outline-purple-700" onClick={handleClickFollow}>Follow</button> */}
                        </div>
                        <h1 className="text-2xl">{userInfo?.username}</h1>
                        <p>{stringToDate(userInfo?.creationTime)}</p>
                        <p className="italic">{numToGender(userInfo?.gender)}</p>
                        <p>{userInfo?.desc}</p>
                    </div>
    );
}