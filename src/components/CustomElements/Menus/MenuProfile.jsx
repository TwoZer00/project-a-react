import { useEffect } from "react";
import { Link } from "react-router-dom";
import projectA from "../../../img/projectA.svg";
import { logout } from "../../../utils/utils";
import ContentPreference from "../../AppSettings/ContentPreference";
import ThemeSelector from "../../AppSettings/ThemeSelector";


export function MenuProfile({ user, profileImage,isDown,setDark,...props }) {

  const handleClick = () =>{
    
    logout();
  }

    // const handleDarkTheme = (e)=>{
    //     let theme = parseInt(e.target.value);
    //     console.log(typeof theme)
    //     switch (theme) {
    //       case 1:
    //         setDark("ligth");
    //         localStorage.setItem('theme', "ligth");
    //       break;
    //       case 2:
    //         setDark("dark");
    //         localStorage.setItem('theme', "dark");
    //       break;
    //       default:
    //         if(window.matchMedia('(prefers-color-scheme: dark)').matches){
    //           setDark("dark");  
    //         }
    //         else{
    //           setDark("ligth");
    //         }
    //         localStorage.removeItem('theme');
    //       break;
    //     }
    // }
    return (
        <>
          <div
          {...props}
            className={`w-72 h-fit mt-2 bg-white outline outline-white outline-1 dark:border-white rounded absolute z-10 top-full right-0 drop-shadow-md dark:bg-neutral-900 cursor-auto ${
              isDown ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-row w-full justify-center items-center gap-x-2 h-28">
              <div className="rounded-full h-full overflow-hidden h-20 w-20">
                <img
                  src={profileImage || projectA}
                  alt=""
                  className={`w-full h-full ${
                    profileImage ? "object-cover" : "p-2.5 bg-purple-700"
                  }`}
                />
              </div>
              <div className="dark:text-white w-fit text-center" tìtle={`${user?"See my profile":"You need login"}`}>
                <p className="w-36 truncate block">{user?.username || "My profile"}</p>
                <Link
                  to={`${user?`/user/${user?.userId}`:`/login`}`}
                  className={`block text-purple-500/60 hover:text-purple-200`}
                >
                  View profile
                </Link>
              </div>
            </div>
            <hr />
            <div className="flex flex-col items-center divide-y">
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
                  onClick={handleClick}
                >
                  Logout
                </button>
              </div>:<div className="w-full hover:bg-purple-200/20 hover:cursor-pointer">
                <Link
                  className={`py-2 dark:text-white text-center block w-full`}
                  to={`/login`}
                >
                  Login
                </Link>
              </div>}
              {/* <div className="flex flex-row w-full dark:text-white justify-center items-center gap-x-2 py-3">
                <label htmlFor="theme" className="cursor-pointer" >Theme</label>
                <select id="theme" className="w-fit dark:bg-neutral-900 dark:text-white p-1 text-center bg-white" onChange={handleDarkTheme} value={localStorage.getItem("theme")?localStorage.getItem("theme")==="dark"?2:1:3}  >
                  <option value="1">Light</option>
                  <option value="2">Dark</option>
                  <option value="3">System Theme</option>
                </select>
              </div> */}
              <ThemeSelector themeFunction={setDark}/>
              {user?<ContentPreference  />:''}
            </div>
          </div>
        </>
      );
}

