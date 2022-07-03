import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import firebase from "../utils/firebase";
import { uploadPost } from "../utils/utils";

export function Upload({user}){
    //console.log(user);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSendingPost,setIsSendingPost] = useState(false);
    //const progress = useRef();
    const [post,setPost] = useState();
    const [progress,setProgress] = useState(0);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log("sending");
        setIsSendingPost(true);
        let form = e.target;
        let obj = {
            title:form.title.value,
            desc:form.desc.value,
            nsfw:form.nsfw.checked,
            userId:user.userId
        }
        let file = form.file.files[0];
        if (form.reportValidity() && file.type.includes("audio")) {
            console.log("send");
            try {
                console.log(await uploadPost(obj, file));
                setIsSendingPost(false);
                form.reset();
            } catch (error) {
                console.error(error.message);
                setIsSendingPost(false);
            }
        }
        else{
            console.log("not send");
        }
    }
    const handleFile = (e)=>{
        let element = e.target;
        console.log(element)
        let file = element.files[0];
        if (file.size / 1024 / 1024 > 60) {
            element.setCustomValidity("File size exceeds 60MB");
        }
    }
    if(user){
        return(<>
            <div className="text-center w-5/6 mx-auto p-2 mt-2 dark:text-white">
                <h1 className="text-2xl mb-2 ">Upload your audio</h1>
                <form className="flex flex-col w-full lg:w-2/5  lg:mx-auto gap-y-2 relative" onSubmit={handleSubmit}>
                    <div className={`absolute h-full w-full bg-white/60 cursor-progress z-1 pointer-events-none ${isSendingPost?'block':'hidden'}`}></div>
                    <input type="text" placeholder="Title" className="border rounded-full p-2 dark:bg-transparent " name="title"  />
                    <div className="flex flex-row gap-x-2">
                        <div className="flex-auto w-1/3">
                            <label htmlFor="nsfw">nsfw</label>
                            <input type="checkbox" name="nsfw" id="nsfw" className="indeterminate:bg-gray-300 "/>
                        </div>
                        <input type="file" name="file" onChange={handleFile} className="flex-auto w-2/3 inline-block file:rounded-full dark:bg-transparent file:bg-purple-50 file:border-0 file:p-2 border-2 rounded-full"/>
                    </div>
                    <textarea name="desc" id="" cols="30" rows="10" className="border px-2 rounded-lg resize-none dark-placeholder:text-black/20 dark:bg-transparent" placeholder="Description"></textarea>
                    <input type="submit" value={`${isSendingPost?"Uploading":"Upload"}`} className="bg-purple-700 text-white rounded-full font-bold text-xl p-3 justify-self-end cursor-pointer disabled:bg-purple-300 disabled:animation-pulse disabled:cursor-not-allowed" disabled={!getAuth().currentUser.emailVerified||isSendingPost} />
                    {getAuth().currentUser.emailVerified?"":<small className="text-sm">In order to upload audios first you need verify your email. Go to <b>Edit profile</b> &gt; click on <b>Verify email</b> </small>}
                </form>
            </div>
        </>);
    }
    else{
        return(<Navigate to='/login' state={{from: location}} replace></Navigate>);
    }
}