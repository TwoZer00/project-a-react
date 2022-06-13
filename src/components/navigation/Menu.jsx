import projectA from "../../img/projectA.svg";
import profileSquare from "../../img/profileImg.jpg";
import microphone from "../../img/microphone-stroke.svg";
import { InboxIcon } from '@heroicons/react/outline'
//import { CustomLink } from "../router/CustomLink";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MenuProfile } from "../CustomElements/Menus/MenuProfile";

export function Menu({profileImage,user,logoutFunction,setDark}){
	const [isDown,setDown] = useState(false);
	const button = useRef();
	const dropdown = (e)=>{
		//console.log(e.target,button.current,isDown)
		if(e.target===button.current){
			console.log("bbb")
			if(isDown){
				setDown(false);
			}
			else{
				setDown(true);
			}
		}
		else{
			console.log("aaa")
			setDown(true);
		}
		
	}
	useEffect(()=>{
	},[user]);
    return (
        <>
            <nav className="w-full lg:w-5/6 m-auto flex flex-row items-center">
				<div className="rounded-full h-12 bg-purple-700 dark:bg-purple-900 m-2 ">
					<Link to="/"><img src={projectA} alt="" className="h-full p-1.5" /></Link>
				</div>
				<p className="text-2xl font-bold dark:text-white">project A</p>
				<div className="flex-1 flex flex-row justify-end align-middle mr-2 gap-2">
					<div className="relative h-full my-auto group hidden">
						<InboxIcon className="w-8 text-slate-300 stroke-2 group-hover:text-slate-500 cursor-pointer"></InboxIcon>
						<div className="bg-red-400 group-hover:bg-red-600 w-3 h-3 rounded-full absolute top-0 right-0 outline outline-white dark:outline-neutral-900"></div>
					</div>
					<Link to="/upload" className="bg-purple-700 dark:bg-purple-900 group hover:bg-purple-700 h-8 p-1 rounded-lg my-auto font-bold text-white cursor-pointer">
						Upload audio
					</Link>
					<div className="h-12 relative hover:cursor-pointer group" onClick={dropdown}>
						<div className="rounded-full h-full overflow-hidden">
							<img
									src={profileImage || projectA}
									alt="profile"
									ref={button}
									className={`h-full w-12 bg-purple-700 dark:bg-purple-900 ${profileImage?"object-cover":"p-1.5"}`}
								/>
						</div>
						<MenuProfile user={user} profileImage={profileImage} isDown={isDown} setDark={setDark} />
					</div>
				</div>
			</nav>
        </>
    );
}