import { useEffect, useRef, useState } from "react";
import { getProfileImageURL, resize, updateProf, uploadProfileImage } from "../utils/utils";
import projectA from "../img/projectA.svg";
import { CameraIcon } from '@heroicons/react/outline'
import { ProfileImage } from "./elements/ProfileImage";

export function ProfileSettings({user,setProfileImage,setUser,img}){

    // if

    //const [profileImageURL,setProfileImageURL] = useState();
    const inputFile = useRef();
    const imgURL = useRef();
    const [isLoadingImage,setIsLoadingImage] = useState(false);
    const [isUpdating,setIsUpdating] = useState(false);

    //const[username,setUsername] = useState(user?.username);

    console.log(user); 
    const handleChangeProfilImage = ()=>{
        inputFile.current.click();
    };
    const handleUploadProfileImage = async (e)=>{
        setIsLoadingImage(true);
        console.log(e.target.files[0])
        let file = e.target.files[0];
        resize(file,imgURL);
        //setProfileImage(await resize(file,imgURL));
    }
    const handleLoad =async (event)=>{
        if(isLoadingImage){
            const newURL = event.target.src;
            console.log("updating profileImage");
            //event.target.className+=' blur-sm'
            // setIsLoadingImage(true);
            await uploadProfileImage(newURL,user.userId);
            setProfileImage(newURL);
            // //event.target.clasName
            // setIsLoadingImage(false);
            //profileImage(event.target.src);    
        }
        else{
            console.log("loading normally profileImage");
        }
        setIsLoadingImage(false);
        //event.target.className+=' blur-sm'
        // setIsLoadingImage(true);
        // await uploadProfileImage(event.target.src,user.userId);
        // //event.target.clasName
        // setIsLoadingImage(false);
        //profileImage(event.target.src);
    }
    const handleUpdateProfile = async (event)=>{
        setIsUpdating(true);
        event.preventDefault();
        let form = event.target;
        let obj = {
            username:(form.username.value).trim()||user?.username,
            gender:form.gender.value || user?.gender,
            desc:(form.desc.value).trim() || user?.desc
        }
        await updateProf(obj,user.userId);
        setUser(Object.assign({},user,obj));
        setIsUpdating(false);
        // //console.log(user)
        // console.log('====================================');
        // console.log(user);
        // console.log('====================================');
        //
    }
    useEffect(()=>{
    },[user]);
    if(user){
        return(
            <div className="m-2">
                <h1 className="font-bold text-center text-2xl dark:text-white">My profile</h1>
                <div className="mb-2 p-1 w-fit mx-auto">
                    <div className="rounded-full bg-purple-700 h-full h-32 w-32 overflow-hidden group relative hover:cursor-pointer" onClick={handleChangeProfilImage}>
                        {/* <img onLoad={handleLoad} ref={imgURL} src={profileImage||projectA} className={`h-full w-full object-cover ${isLoadingImage?'bg-blur':''}`} alt="" /> */}
                        <ProfileImage onLoad={handleLoad} refa={imgURL} img={img} user={user} setImage={setProfileImage} className={`object-cover h-full w-full ${isLoadingImage?"blur-sm animate-pulse":""}`}  />
                        <div className="h-1/3 w-full bg-white/60 bottom-0 inset-x-0 absolute lg:hidden group-hover:block">
                            <CameraIcon className="h-full text-center w-full text-black/30"></CameraIcon>
                        </div>
                    </div>
                    <input type="file" onChange={handleUploadProfileImage} ref={inputFile} accept="image/*" className="hidden" />
                </div>
                <form className="px-2 text-lg dark:text-white" name="updateProfile" onSubmit={handleUpdateProfile}>
                    <div className="mb-2">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" placeholder={user.username} className="border w-full px-2 rounded  dark:bg-transparent" />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="desc">Description</label>
                        <input type="text" name="desc" id="desc" placeholder={user.desc.length<=0?'Description':user.desc} className="  dark:bg-transparent border rounded px-1 w-full" />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="gender">Genre</label>
                        <select name="gender" id="gender" className="dark:text-white dark:bg-transparent dark:border rounded" defaultValue={user.gender} placeholder={user.gender}>
                            <option value="0">Female</option>
                            <option value="1">Male</option>
                            <option value="2">No specify</option>
                        </select>
                    </div>
                    <div>
                        <input type="submit" value={isUpdating?"Updating...":"Update"} className="my-2 bg-purple-700 p-2 rounded-full text-white" disabled={isUpdating?"true":false} />
                    </div>
                </form>
            </div>
        );
    }
}