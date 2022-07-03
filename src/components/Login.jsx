import { useState } from "react";
import { getAuth, signInWithEmailAndPassword,signOut } from "firebase/auth";
import { loginUsernamePassword } from "../utils/utils";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

export function Login({cursorState}){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const auth = getAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [info,setInfo] = useState();
    let location = useLocation();
    let navigate = useNavigate();
    const login = async (e)=>{
        setIsLoading(true);
        cursorState('cursor-wait');
        e.preventDefault();
        try {
            await loginUsernamePassword(email,password);
            setIsLoading(false);
            cursorState('');
        } catch (error) {
            console.error(error.code,error.message);
            setInfo(error.code);
            setIsLoading(false);
            cursorState('');
        }
    }
    const handleEmail = (e)=>{
        setEmail(e.target.value);
    }
    const handlePassword = (e)=>{
        setPassword(e.target.value);
    }
    if(auth.currentUser){
        const from = location.state?.from?.pathname || `/user/${auth.currentUser.uid}`; 
        navigate(from,{replace:true});
    }else{
        return (
            <>
                <div className="flex flex-row h-full items-center">
                    <div className="flex-1 h-full bg-purple-200"></div>
                    <div className="flex-auto w-2/6">
                        <h1 className="text-center text-2xl font-bold mt-3 dark:text-white">Login</h1>
                        <p className="dark:text-white text-center">Be able to share every kind of audio with other listener.</p>
                        <p className="dark:text-white text-center">You dont have an account? <Link to="/register" className="font-bold hover:underline">create one.</Link></p>
                        <div className="relative w-3/5 mx-auto">
                            <div className={`w-full h-full bg-white/20 absolute rounded cursor-wait ${isLoading?'':'hidden'} `}></div>
                            <form className={`w-full mt-2 flex flex-col gap-2`} onSubmit={login}>
                                <input type="email" className="flex-auto border h-10 rounded p-3 w-full disabled:text-gray-400 disabled:bg-gray-200 dark:bg-neutral-900 dark:text-white" placeholder="Email" onChange={handleEmail}  disabled={isLoading} autoFocus />
                                <input type="password" className="flex-auto border h-10 rounded p-3 disabled:text-gray-400 disabled:bg-red-200 dark:bg-neutral-900 dark:text-white" placeholder="Password" onChange={handlePassword} disabled={isLoading}  />
                                <input type="submit" className={`flex-auto w-full h-10 rounded-full w-full cursor-pointer bg-purple-700 text-white disabled:bg-purple-500`} value={`${isLoading?'Loading':'Login'}`} disabled={isLoading} />
                                <small className="text-sm dark:text-white text-center">{info}</small>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}