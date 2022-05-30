import { UsersIcon } from "@heroicons/react/outline";
import { useEffect } from "react";

export function FollowerCounter({count}){
    useEffect(()=>{

    },[count]);
    return(<>
        <p className="inline text-lg leading-none  pr-1 align-middle">{count||0}</p>
        <UsersIcon className="inline h-5"/>
    </>);
}