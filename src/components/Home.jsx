import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import PostList from "./PostList";
const db = getFirestore(firebase);

export function Home({player}){
    const [querySnapshot,setQuerySnapshot] = useState();
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
        }
        if(!querySnapshot){
            getPosts();
        }
    },[querySnapshot]);
    if(!querySnapshot){
        return (
            <div className="flex flex-col h-full justify-center items-center">
                <PostList/>
            </div>
        );
    }
    else{
        return(
            <div className={`w-full px-2 lg:w-5/6 lg:mx-auto flex flex-col gap-2 mt-2`}>
                <PostList postArray={querySnapshot?.docs} playerFunction={player} />
            </div>)
    }
}