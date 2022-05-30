import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";
import { Element } from "./elements/Element";
const db = getFirestore(firebase);

export function Home({player}){
    const [querySnapshot,setQuerySnapshot] = useState();
    const [isLoading,setisLoading] = useState(true);
    useEffect(()=>{
        async function getPosts(){
            let postRef = collection(db, "post");
            let q;
            if(localStorage.getItem("nsfw") === true){
                q = query(postRef, orderBy("date","desc"));
            }
            else{
                q = query(postRef, where("nsfw", "!=", true),orderBy("nsfw","asc"),orderBy("date","desc"));
            }
            setQuerySnapshot(await getDocs(q));
            setisLoading(false);
        }
        getPosts();
    },[]);
    if(isLoading){
        return (
            <div className="w-full px-2 lg:w-5/6 lg:mx-auto flex flex-col gap-2">
                {[1,2,3,4,5].map(()=><Element post={undefined} isLoading={isLoading}></Element>)}
            </div>
        );
    }
    else{
        return(
            <div className="w-full px-2 lg:w-5/6 lg:mx-auto flex flex-col gap-2">
                {
                    querySnapshot?.docs.map((doc) => <Element play={player} post={doc.data()} id={doc.id}  key={doc.id} user={doc.data().userId} />)
                }
            </div>
        );
    }
}