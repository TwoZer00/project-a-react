import { useEffect } from "react";
import { Link } from "react-router-dom";
import projectA from "../../../img/projectA.svg";
import { logout } from "../../../utils/utils";


export function MenuProfile({ user, profileImage,isDown,setDark,...props }) {
    const handleDarkTheme = (e)=>{
        let theme = parseInt(e.target.value);
        console.log(typeof theme)
        
        switch (theme) {
            case 2:
                setDark("dark");
                localStorage.setItem('theme', "dark");
                break;
        
            default:
                setDark("ligth");
                localStorage.setItem('theme', "ligth");
                break;
        }
    }
    return (
        <>
          <div
          {...props}
            className={`w-72 h-fit mt-2 bg-white outline outline-white outline-1 dark:border-white rounded absolute z-10 top-full right-0 drop-shadow-md dark:bg-neutral-900 ${
              isDown ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-row w-full justify-center items-center gap-x-2 h-28">
              <div className="rounded-full h-full overflow-hidden h-20 w-20 ">
                <img
                  src={profileImage || projectA}
                  alt=""
                  className={`w-full h-full ${
                    profileImage ? "object-cover" : "p-1.5"
                  }`}
                />
              </div>
              <div className="dark:text-white w-fit">
                <p className="w-36 truncate block">{user?.username}</p>
                <Link
                  to={`/user/${user?.userId}`}
                  className={`text-center block text-purple-500/60 hover:text-purple-200`}
                >
                  View profile
                </Link>
              </div>
            </div>
            <hr />
            <div className="flex flex-col items-center divide-y">
              <div className="flex flex-row w-full  hover:bg-purple-200/20 dark:text-white justify-center items-center gap-x-2 py-3">
                <p className="w-2/5">Theme</p>
                <select className="w-2/5 dark:bg-transparent" onChange={handleDarkTheme} value={localStorage.getItem("theme")==="dark"?2:1 || (window.matchMedia("(prefers-color-scheme: dark)").matches?2:1) }  >
                  <option value="1">Light</option>
                  <option value="2">Dark</option>
                </select>
              </div>
              {user?<div className="w-full hover:bg-purple-200/20 hover:cursor-pointer ">
                <Link
                  to="/settings/user"
                  className="dark:text-white block text-center py-3"
                >
                  Edit profile
                </Link>
              </div>:""}
              {user?<div className="w-full hover:bg-purple-200/20 hover:cursor-pointer ">
                <Link
                  to="/feed"
                  className="dark:text-white block text-center py-3"
                >
                  Feed
                </Link>
              </div>:""}
              {user?<div className="w-full hover:bg-purple-200/20 hover:cursor-pointer">
                <button
                  className={`py-2 dark:text-white text-center block w-full`}
                  onClick={logout}
                >
                  Logout
                </button>
              </div>:""}
            </div>
            {/* <div className="flex flex-col h-fit divide-y first:pt-2 last:pb-2 text-center content-center">
                                  {user?<Link to={`/user/${user.userId}`} className={`w-full dark:text-white h-1/4 hover:bg-purple-200 dark-hover:bg-purple-200/10 hover:cursor-pointer p-2`}>Profile</Link>:''}
                                  <Link to={user?'/settings/user':'/settings'} className={`${user?"h-1/4":"h-1/2"} dark:text-white hover:bg-purple-200 dark-hover:bg-purple-200/10 hover:cursor-pointer p-2`}>Settings</Link>
                                  {user?<Link to={`/feed`} className={`w-full h-1/4 hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2 dark:text-white`}>Feed</Link>:''}
                                  {user?<button className={`h-1/4 hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2 dark:text-white`} onClick={logoutFunction}>Logout</button>:<Link to='/login' className="h-1/2 dark:text-white hover:bg-purple-200 dark-hover:bg-purple-200/20 hover:cursor-pointer p-2">Login</Link>}
                              </div> */}
          </div>
        </>
      );
}

