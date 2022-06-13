import { Element } from "./elements/Element";

export default function UserPost({postArray,...props}){
    console.log(postArray.length);
    if(postArray.length>0){
        return(postArray.map((post)=><Element post={post.data()} id={post.id} {...props} key={post.id} />));
    }
}