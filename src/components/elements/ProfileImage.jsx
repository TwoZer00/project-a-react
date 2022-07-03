import { useEffect } from "react"
import { getProfileImageURL } from "../../utils/utils";
import projectA from "../../img/projectA.svg";

export function ProfileImage({img,refa,user,setImage, ...props}){
    useEffect(()=>{
        const getImageUrl = async (userid)=>{
            try{
                const image = await getProfileImageURL(userid);
                setImage(image);
            }
            catch(error){
                console.error(error.message);
            }
        }
        if(!img){
            getImageUrl();
        }
    },[img,setImage]);

    return(
        <img src={img||projectA} alt={`${user.username}profile's`} ref={refa} {...props}/>
    )
}