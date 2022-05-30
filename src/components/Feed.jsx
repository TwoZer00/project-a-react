import { useEffect, useRef, useState } from "react";
import { getUserFeed, getUserFollowers, getUserFollowing } from "../utils/utils";
import { Element } from "./elements/Element";

export function Feed({user,player}){
    const [feedCollection,setFeedCollection] = useState();
    const [following,setFollowing] = useState();
    useEffect(()=>{
        const fetchData = async()=>{
            setFollowing(await getUserFollowing(user.userId));
            setFeedCollection(await getUserFeed(user.userId));
        }
        fetchData();
    },[user]);
    if(feedCollection){
        return(
            <div className="w-full lg:w-5/6 lg:mx-auto px-2 mt-2 mb-[110px]">
                <div className="w-full border h-12 mb-2 rounded"></div>
                <div className="w-full flex flex-col gap-y-2">
                    {feedCollection?.map(element=> <Element play={player} post={element.data()} id={element.id} isLoading={false}  />)}
                </div>
            </div>
        );
    }
    else{
        return(
            <div className="w-full lg:w-5/6 lg:mx-auto px-2 mt-2 mb-[113px] flex flex-col gap-y-2">
                <Element id={undefined} isLoading={true}/>
                <Element id={undefined} isLoading={true}/>
                <Element id={undefined} isLoading={true}/>
                {/* {feedCollection?.map(element=> <Element post={element.data()} id={element.id} isLoading={false}  />)} */}
            </div>
        );
    }
}