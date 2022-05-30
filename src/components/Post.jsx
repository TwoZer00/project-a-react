import {  useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase from "../utils/firebase";
import projectA from "../img/projectA.svg";
import { getUsername, stringToDate } from "../utils/utils";
const db = getFirestore(firebase);
export function Post({handleAudioURL}){
    let { postId } = useParams();
    const [postDetails,setPostDetails] = useState({});
    //let audio=useRef('');
    let post = useRef();
    const handleClick = (e)=>{
        e.preventDefault();
        console.log(e);
        handleAudioURL(postDetails);
    }
    useEffect(()=>{
        async function getPostDetails(){
            const docRef = doc(db, "post", postId);
            const docSnap = await getDoc(docRef); 
            
            if (docSnap.exists()) {
                let obj = docSnap.data();
                obj.username = await getUsername(obj.userId);
                obj.id = docSnap.id;
                setPostDetails(obj);
                //audio.current = docSnap.data().fileURL;
                //const username = await getUsername(docSnap.data().userId);
                //post.current = docSnap.data();
                //post.current.username = username;
                
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                //
            }
        }
        getPostDetails();
    },[postId]);
    return (
    <>
     <div className="m-2">
            <div className="border flex flex-col-reverse lg:flex-row place-items-center w-full lg:w-5/6 lg:mx-auto ">
                <div className="flex-auto w-full lg:w-2/3 text-center">
                    <h1 className="text-2xl font-bold">{postDetails?.title}</h1>
                    <p className="">{new Date(postDetails?.date?.seconds*1000).toLocaleDateString()}</p>
                    <p className="">{postDetails?.desc}</p>
                    <button className="bg-purple-500 text-white rounded-full px-1" onClick={handleClick}>Listen audio</button>
                </div>
                <div className="flex-auto w-full lg:w-1/3 bg-purple-100 p-5">
                    <div className="max-h-52 max-w-52 h-52 w-52 bg-purple-700 rounded-full mx-auto">
                        <img src={projectA} alt="" className="p-5 h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}