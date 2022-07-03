import { applyActionCode, getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "./components/Spinner";
import { setEmailVerify } from "./utils/utils";

export default function EmailVerify({auth}){
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const actionCode = params.get("oobCode");
    const lang = params.get("lang")||"en";
    //console.log(mode,actionCode,lang);
    const [loading,setLoading] = useState(true);
    
    const [info,setInfo] = useState();
    if(auth.currentUser && !auth.currentUser.emailVerified){
        console.log(auth.currentUser);
        handleVerifyEmail()
    }

    async function handleVerifyEmail(){
        try {
            console.log(actionCode);
            await applyActionCode(auth,actionCode);
            //await setEmailVerify(auth.currentUser.uid);
        } catch (error) {
            console.error(error.message);
        }
    }
// const verifyEmail = async ()=>{
//     await handleVerifyEmail();
// }
//     if(!auth?.currentUser?.emailVerified){
//         console.log(auth.currentUser)
//         switch (mode) {
//             case 'resetPassword':
//               // Display reset password handler and UI.
//               //handleResetPassword(getAuth(), actionCode, lang);
//               break;
//             case 'recoverEmail':
//               // Display email recovery handler and UI.
//               //handleRecoverEmail(getAuth(), actionCode, lang);
//               break;
//             case 'verifyEmail':
//               // Display email verification handler and UI.
//               verifyEmail();
//               //return(<Spinner></Spinner>);
//               break;
//             default:
//               //return(<Spinner></Spinner>);
//           }
//     }
//     else{
//         setLoading(false);
//     }
    if(loading){
         return(<div className="flex flex-col h-full justify-center items-center"><Spinner/></div>);
    }
    else{
        return(
            <Navigate to="/settings/user" replace></Navigate>
        );
    }
}