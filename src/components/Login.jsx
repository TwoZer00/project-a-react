import { useState } from "react";
import { getAuth, signInWithEmailAndPassword,signOut } from "firebase/auth";
import { loginUsernamePassword } from "../utils/utils";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export function Login({user}){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const auth = getAuth();
    const [isLoading, setIsLoading] = useState(false);
    let location = useLocation();
    let navigate = useNavigate();
    //const from='';
    const login = async (e)=>{
        setIsLoading(true);
        e.preventDefault();
        //console.log(email,password);
        try {
            //console.log('Helooooo',isLoading);
            await loginUsernamePassword(email,password);
            setIsLoading(false);
            //console.log('Hellowww',isLoading,auth.currentUser);
            //console.log(location.state?.from?.pathname)
            //const from = location.state?.from?.pathname || `/user/${auth.currentUser.uid}`; 
            //navigate(from,{replace:true});
        } catch (error) {
            console.error(error.code,error.message);
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
        //return(<Navigate to={from} replace/>);
    }else{
        return (
            <>
                <h1 className="text-center text-2xl font-bold mt-3 dark:text-white">Login</h1>
                <form className="w-full px-2 lg:w-2/5 lg:mx-auto mt-2 flex flex-col gap-2" onSubmit={login}>
                    <input type="email" className="flex-auto border h-10 rounded p-3 w-full disabled:text-gray-400 disabled:bg-gray-200" placeholder="email" onChange={handleEmail}  disabled={isLoading} />
                    <input type="password" className="flex-auto border h-10 rounded p-3 disabled:text-gray-400 disabled:bg-gray-200" placeholder="password" onChange={handlePassword} disabled={isLoading}  />
                    <input type="submit" className={`flex-auto w-full h-10 rounded-full w-full cursor-pointer bg-purple-700 text-white disabled:bg-purple-500`} value={`${isLoading?'Loading':'Login'}`} disabled={isLoading} />
                </form>
            </>
        );
    }
}