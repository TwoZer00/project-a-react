import { getAuth } from "firebase/auth";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import ContentPreference from "./AppSettings/ContentPreference";
import ThemeSelector from "./AppSettings/ThemeSelector";
import { MenuSettings } from "./navigation/MenuSettings";
import { ProfileSettings } from "./ProfileSettings";

export function Settings({setDark}){
    return(
        <div className="h-fit w-screen px-2 dark:text-white">
            <div className="w-full h-fit flex flex-col divide-y">
                <ThemeSelector themeFunction={setDark}/>
                {getAuth().currentUser?<ContentPreference  />:''}
            </div>
        </div>
    );
}