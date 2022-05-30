import projectA from "../../img/projectA.svg";
import microphone from "../../img/microphone-stroke.svg";
import { InboxIcon } from '@heroicons/react/outline'
//import { CustomLink } from "../router/CustomLink";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Menu({profileImage,user,logoutFunction}){
	const [isDown,setDown] = useState(false);
	const dropdown = ()=>{
		if(isDown){
			setDown(false);
		}
		else{
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
					<div className="relative h-full my-auto group">
						<InboxIcon className="w-8 text-slate-300 stroke-2 group-hover:text-slate-500 cursor-pointer"></InboxIcon>
						<div className="bg-red-400 group-hover:bg-red-600 w-3 h-3 rounded-full absolute top-0 right-0 outline outline-white dark:outline-neutral-900"></div>
					</div>
					<Link to="/upload" className="bg-purple-700 dark:bg-purple-900 group hover:bg-purple-700 h-8 p-1 rounded-lg my-auto font-bold text-white cursor-pointer">
						Upload audio
						{/* <img src={microphone} alt="" className="h-6 bg-white" /> */}
						{/* <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full stroke-white" viewBox="0 0 82 190">
							<path d="M77,149a36,36,0,0,1-72,0v-9H32a9,9,0,0,0,0-18H5V104H32a9,9,0,0,0,0-18H5V68H32a9,9,0,0,0,0-18H5V41a36,36,0,0,1,72,0Z" fill="none" stroke-miterlimit="10" stroke-width="12"/>
						</svg> */}
					</Link>
					<div className="h-12 relative hover:cursor-pointer group" onClick={dropdown}>
						<div className="rounded-full h-full overflow-hidden">
							<img
									src={profileImage || projectA}
									alt="profile"
									className={`h-full w-12 bg-purple-700 dark:bg-purple-900 ${profileImage?"object-cover":"p-1.5"}`}
								/>
						</div>
						<div className={`w-32 w-max-40 h-fit h-max-32 bg-white border dark:border-white rounded absolute z-10 top-full right-0 drop-shadow-md dark:bg-neutral-900 ${isDown?'block':'hidden'}`}>
							<div className="flex flex-col h-fit divide-y first:pt-2 last:pb-2 text-center content-center">
								{user?<Link to={`/user/${user.userId}`} className={`w-full dark:text-white h-1/4 hover:bg-purple-200 hover-dark:bg-purple-200/20 hover:cursor-pointer p-2`}>Profile</Link>:''}
								<Link to={user?'/settings/user':'/settings/app'} className={`${user?"h-1/4":"h-1/2"} dark:text-white hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2`}>Settings</Link>
								{user?<Link to={`/feed`} className={`w-full h-1/4 hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2 dark:text-white`}>Feed</Link>:''}
								{user?<button className={`h-1/4 hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2 dark:text-white`} onClick={logoutFunction}>Logout</button>:<Link to='/login' className="h-1/2 dark:text-white hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2">Login</Link>}
							</div>
						</div>
					</div>
				</div>
			</nav>
        </>
    );
}