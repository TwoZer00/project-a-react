import { useEffect, useState } from "react";
import { numToGender, stringToDate } from "../../utils/utils";
import { FollowerCounter } from "../elements/FollowersCounter";
import projectA from "../../img/projectA.svg"
import FollowButton from "./FollowButton";
import Reproductions from "./Reproductions";

export default function ProfileDetails({userInfo,profileImage,userLogged,followers,setFollowers,reproductions}){
    return(
        <div className="flex-auto w-full lg:w-1/4 border rounded text-center dark:text-white">
            <div className="border-b mb-1">
                <h1 className="text-2xl h-fit inline">{userInfo?.username}</h1>
                <small className="text-xs dark:text-purple-200/60 text-black/20">{numToGender(userInfo?.gender)}</small>
            </div>
            <div className="h-42 border-b relative p-2">
                <div className="overflow-hidden rounded-full h-32 w-32 mx-auto">
                    <img src={profileImage||projectA} alt="" className={`w-full object-cover h-full drop-shadow-xl ${profileImage?"":"p-4"}`} />
                </div>
                {userLogged?.userId===userInfo.userId?'':<FollowButton followerId={userLogged?.userId} followingId={userInfo.userId} followers={followers} setFollowers={setFollowers} />}
            </div>
            <div className="w-full flex w-full divide-x py-1 border-b">
                <div className="w-full">
                    <FollowerCounter count={followers?.length} title="Followers" />
                </div>
                <div className="w-full">
                    <Reproductions counter={reproductions} title="Reproductions" />
                </div>
            </div>
            {/* <p>{stringToDate(userInfo?.creationTime)}</p> */}
            {/* <small className="text-sm">User since</small>
            <p className="mb-2">{stringToDate((new Date(userInfo.creationTime)).getTime())}</p> */}
            <p>{userInfo?.desc}</p>
        </div>
    );
}