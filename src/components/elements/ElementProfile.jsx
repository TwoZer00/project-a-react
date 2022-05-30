import { Link } from "react-router-dom";
import { PlayIcon } from '@heroicons/react/outline'

export function ElementProfile({title,desc,postId}){
    return (
        <div className="rounded bg-white flex flex-row rounded border">
            <div className="flex-none bg-purple-50">
                <Link to={`/post/${postId}`}><PlayIcon className="stroke-1 stroke-purple-700 h-20"></PlayIcon></Link>
            </div>
            <div className="flex-1 my-auto">
                <h1 className="text-lg">{title}</h1>
                <p>{desc}</p>
            </div>
        </div>
    );
}