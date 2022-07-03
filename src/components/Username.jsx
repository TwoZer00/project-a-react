import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsername } from "../utils/utils";

export default function Username({id,className,children}){
    const [username,setUsername] = useState();
    const [isUsernameLoading,setIsUsernameLoading] = useState(true);
    useEffect(()=>{
        const gUser = async()=>{
            setUsername(await getUsername(id));
            setIsUsernameLoading(false);
        }
        if(!children){
            gUser();
        }
        else{
            setUsername(children);
            setIsUsernameLoading(false);
        }
    },[children, id]);
    return(
        <Link to={`/user/${id}`} className={`${className} ${isUsernameLoading?'bg-purple-100 w-32 rounded':''}`}>{username}</Link>
    );
}