import { useEffect } from "react";
import PostElement from "./PostElement";
import Spinner from "./Spinner";

export default function PostList({postArray,playerFunction, username}){
    //console.log(playerFunction);
    //console.warn(postArray);
    // useEffect(()=>{},[postArray]);
    if(postArray?.length>=1){
        return(postArray.map((post)=><PostElement username={username} postData={post.data()} postId={post.id} key={post.id} setPlay={playerFunction} />));
    }
    else if(postArray?.length===0){
        return(<>
            <h1 className="dark:text-white text-center font-bold">No post</h1>
        </>);
    }
    else{
        return(
            <Spinner/>
        );
    }
}

