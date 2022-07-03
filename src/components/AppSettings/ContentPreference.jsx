import { useRef } from "react";
import { useState } from "react";
import NsfwCheckbox from "./NsfwCheckbox";

export default function ContentPreference(){
    const [nsfw,setNsfw] = useState(localStorage.getItem("nsfw")==='true');
    const checkbox = useRef();
    const handleChange = (e)=>{
        console.log(e.target.checked);
        const val = e.target.checked;
        localStorage.setItem("nsfw",val);
        setNsfw(localStorage.getItem('nsfw')==='true');
    }
    return(<>
        <div className="flex flex-row w-full justify-evenly content-center items-center h-12 cursor-pointer" ref={checkbox}>
            <div className="flex-1 w-1/2 text-center h-fit">
                <label htmlFor="nsfw" className="text-red-600 font-bold w-full cursor-pointer block">NSFW</label>
                <small className="text-sm dark:text-white/70">You {localStorage.getItem("nsfw")==='true'?"will":"will not"} see content marked as NSFW </small>
            </div>
            <div className="flex-1 w-1/2 h-fit">
                <input type="checkbox" className="w-full h-6 accent-purple-900 cursor-pointer" id="nsfw" defaultChecked={nsfw} onChange={handleChange}/>
            </div>
        </div>
    </>);
}