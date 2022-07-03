import { UsersIcon } from "@heroicons/react/outline";
import { useEffect } from "react";

export function FollowerCounter({count,...props}){
    useEffect(()=>{

    },[count]);
    return(<div {...props}>
        Followers
        <p className="text-lg leading-none pr-1 align-middle">{count||0}</p>
    </div>);
}