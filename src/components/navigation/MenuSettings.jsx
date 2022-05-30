import { Link, NavLink, Outlet, useMatch, useResolvedPath } from "react-router-dom";
import { CustomLink } from "../../utils/utils";

export function MenuSettings({user}){
    return(
        <div className="">
            <div className="w-full px-2 h-12">
                <div className="flex flex-row h-full bg-gray-200 dark:bg-transparent dark:text-white text-center group overflow-hidden">
                    <div className="flex-1 flex items-center" title={user?"":"You need to be log in"}>
                        <CustomLink to="user" className={`flex-1 py-6 ${user?"":"pointer-events-none text-white/20 select-none"}`}>User</CustomLink>
                    </div>
                    <div className="flex-1 flex items-center">
                        <CustomLink to="" className="flex-1 py-6" >Settings</CustomLink>
                    </div>
                </div>
            </div>
            <Outlet/>
        </div>
    );
}