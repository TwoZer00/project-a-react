import { EyeIcon,EyeOffIcon } from '@heroicons/react/outline'
import { useRef } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkUsernameValidity, createUserAuth, UserAlreadyExistException } from '../utils/utils';
export default function Signup(){
    const [icon,setIcon] = useState();
    const [pass,setPass] = useState();
    const [info,setInfo] = useState();
    const [loading,setLoading] = useState();
    const [userId,setUserId] = useState();
    const handlePassInput = (e) =>{
        let element = e.target.previousElementSibling;
        if(element.type === "text"){
            setIcon(false)
        }
        else{
            setIcon(true)
        }
    }
    const handleForm = async (e) =>{
        setLoading(true);
        e.preventDefault();
        let form = e.target;
        if(form.checkValidity()){
            let user = {username:((form.username.value).trim()).replace(" ",""),gender:form.gender.value};
            let authUser = {email:(form.email.value).trim(),password:form.pass.value}
            console.log(user,authUser)
            try {
                if(await checkUsernameValidity(user.username)){
                    console.log("aaaa")
                    throw new UserAlreadyExistException("User already exist, try new one."); 
                }
                else{
                    console.log("bbbbb")
                    setInfo("")
                }
                //console.log(user,"a");
                setUserId(await createUserAuth(user,authUser));
                setLoading(false)
            } catch (error) {
                //console.log(error)
                setInfo((error.message).replace("Firebase:",""));
                setLoading(false)
                //setInfo(error)
            }
            //console.log("sended",form.email.value,(form.username.value).trim(),form.gender.value,form.pass.value)
        }
    }
    const handleChange = (e) =>{
        let element = e.target;
        if(element.value!==pass){
            setInfo("Password are different");
        }
        else{
            setInfo("");
        }
    }
    if(!userId){
        return(<>
            <div className="flex h-full items-center">
                <div className="flex-auto bg-purple-200 h-full"></div>
                <div className="flex-auto 1/3">
                    <h1 className="dark:text-white text-center font-bold text-2xl">Register</h1>
                    <p className='dark:text-white text-center mb-1'>Create an account and be part of the project a community, share and listen every kind of audios.</p>
                    <form className="px-1 flex flex-col gap-y-2 w-3/5 mx-auto" onSubmit={handleForm}>
                        <input type="email" placeholder="Email" name='email' className="bg-transparent border w-full rounded p-1 dark:text-white" required  disabled={loading}/>
                        <div className="flex gap-x-2">
                            <input type="text" placeholder="Username" name='username' className="bg-transparent border w-full rounded p-1 dark:text-white" required disabled={loading}/>
                            <select name="gender" id="" defaultValue="" className="dark:text-white dark:bg-neutral-900" required>
                                <option value="" disabled >Select gender</option>
                                <option value="0">Female</option>
                                <option value="1">Male</option>
                                <option value="2">No specify</option>
                            </select>
                        </div>
                        <div className="relative w-full ">
                            <input type={`${icon?"text":"password"}`} placeholder="Password" name='pass' onChange={e => setPass(e.target.value)} min="6" className="bg-transparent border w-full rounded p-1 dark:text-white invalid:border-red-100" required disabled={loading}/>
                            <div className="absolute inset-y-0 right-0 w-fit hover:cursor-pointer text-white" onClick={handlePassInput} >
                                {icon?<EyeIcon className='h-full w-12 py-1 pointer-events-none'/>:<EyeOffIcon className='h-full w-12 py-1  pointer-events-none'/>}
                            </div>
                        </div>
                        <div className="relative w-full ">
                            <input type={`${icon?"text":"password"}`} placeholder="Confirm password" name='cpass' onChange={handleChange} min="6" className="bg-transparent border w-full rounded p-1 dark:text-white" required disabled={loading}/>
                            <div className="absolute inset-y-0 right-0 w-fit hover:cursor-pointer text-white" onClick={handlePassInput}>
                                {icon?<EyeIcon className='h-full w-12 py-1 pointer-events-none'/>:<EyeOffIcon className='h-full w-12 py-1 pointer-events-none'/>}
                            </div>
                        </div>
                        <small className='text-xs dark:text-purple-200 font-bold'>{info}</small>
                        <input type="submit" value={`${loading?"Sending...":"Send"}`} className='bg-purple-700 text-white rounded p-1 hover:cursor-pointer disabled:bg-purple-500 hover-disabled:cursor-auto' disabled={loading}/>
                    </form>
                </div>
            </div>
        </>);
    }
    else{
        return(
            <Navigate replace to={`/settings/user`}></Navigate>
        );
    }
}