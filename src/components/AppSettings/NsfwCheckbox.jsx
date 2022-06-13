export default function NsfwCheckbox({nsfw,change}){
    return(
        <input type="checkbox" className="w-full h-6 accent-purple-900" id="nsfw" defaultChecked={nsfw} onChange={change} title={`You ${nsfw?'will':'will not'} see content marked as NSFW`}/>
    );
}