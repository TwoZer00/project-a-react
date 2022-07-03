import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";
import { Element } from "./elements/Element";
import PostList from "./PostList";
import Spinner from "./Spinner";
import UserPost from "./UserPost";
const db = getFirestore(firebase);

export function Home({player}){
    const [querySnapshot,setQuerySnapshot] = useState();
    const [isLoading,setisLoading] = useState(true);
    useEffect(()=>{
        async function getPosts(){
            console.log("Getting post for HOME page")
            let postRef = collection(db, "post");
            let q;
            if(localStorage.getItem("nsfw") === 'true'){
                q = query(postRef, orderBy("date","desc"));
            }
            else{
                q = query(postRef, where("nsfw", "!=", true),orderBy("nsfw","asc"),orderBy("date","desc"));
            }
            setQuerySnapshot(await getDocs(q));
            setisLoading(false);
        }
        if(!querySnapshot){
            getPosts();
        }
    },[]);
    if(isLoading){
        return (
            <div className="flex flex-col h-full justify-center items-center">
                <PostList/>
            </div>
        );
    }
    else{
        return(
            <div className={`w-full px-2 lg:w-5/6 lg:mx-auto flex flex-col gap-2`}>
                <PostList postArray={querySnapshot?.docs} playerFunction={player} />
            </div>)
    }
}