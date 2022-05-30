import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { daysAgo, getUsername } from "../../utils/utils";
import {PlayIcon} from "@heroicons/react/solid";

export function Element({post,id,isLoading,play}){
    const [username,setUsername] = useState();
    const [isUsernameLoading,setIsUsernameLoading] = useState(true);
    const handleClick = ()=>{
        play(post)
    }
    const handleViewMore = ()=>{
        
    }
    useEffect(()=>{
        const gUser = async()=>{
            setUsername(await getUsername(post.userId));
            post.username = username;
            setIsUsernameLoading(false);
        }
        if(post){
            gUser();
        }
    },[post]);
    if(post){
        return(
            <div className={`rounded w-full p-2 dark:text-white border ${isLoading?'bg-gray-50 h-24 animate-pulse':''}`}>
                <Link to={`/user/${post.userId}`} className={`mr-2 inline underline ${isUsernameLoading?'bg-purple-100 w-32':''}`}>{username}</Link>
                <p className="text-xs inline bg-purple-300 rounded p-1 text-neutral-900">{daysAgo(post?.date)}</p>
                <div className="text-2xl cursor-pointer" onClick={handleClick} >
                    {post.title}
                </div>
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate doloremque culpa eum tempore? Culpa aspernatur, animi impedit dignissimos fugit ad nesciunt maxime reprehenderit? Doloribus eum tempore magni odio, sint magnam quia voluptatum non repellat modi minus. Cupiditate nulla, obcaecati, voluptatum harum exercitationem quia ipsum, eveniet rem saepe consequatur dolorem libero placeat autem quo omnis quas. Totam quasi animi, repellat modi dolor, laborum voluptates inventore architecto doloremque harum ducimus, dicta voluptate eius tempora sunt provident error labore nostrum velit ullam placeat eos sed sint? Iure officia aliquam commodi eum illo, error repellat laboriosam aspernatur magnam cumque at. Amet deleniti explicabo dolorum consequatur quam architecto quo incidunt? Eveniet iure consequatur tempore velit magni suscipit fugit quaerat, quo ratione veritatis praesentium. Molestiae tenetur repudiandae, cupiditate rem totam perferendis neque modi provident sequi? Consequuntur laudantium provident ullam tempora earum est minus accusantium animi. Omnis error inventore voluptate sunt officiis cumque, assumenda iure ex vero saepe hic quaerat eligendi modi dicta reprehenderit, recusandae animi earum numquam. Est unde repudiandae sunt assumenda, consequatur magni labore incidunt. Quaerat, similique. Ducimus necessitatibus, enim praesentium saepe harum, quod quae ipsam doloremque eveniet excepturi a iusto aliquid possimus corrupti porro quisquam, quidem id unde numquam vitae. Optio at aliquam perspiciatis. */}
                {/* <Link to={`/post/${id}`} className="text-2xl mr-2 block">{post.title}</Link> */}
                <Link to={`/post/${id}`} className={`truncate block`}>{post.desc}</Link>
            </div>
        );
    }
}