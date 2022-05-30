import { useEffect } from "react"
import { getProfileImageURL } from "../../utils/utils";

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

    if(img){
        return(
            <img src={img} ref={refa} alt={`${user.username}profile's`} {...props}/>
        )
    }
}