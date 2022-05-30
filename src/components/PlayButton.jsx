import { PauseIcon, PlayIcon, RefreshIcon } from "@heroicons/react/solid";

export function PlayButton({state,className,...props}){
    switch(state){
        case "playing":
            return(<>
                <PauseIcon className={`"transition-all ${className} h-20 hover:scale-110 shadow-lg"`} {...props} />
                {/* {
                                        !audioElement.current?.paused?():
                                    } */}
            </>);
        case "paused":
            return(<>
                <PlayIcon className={`transition-all hover:scale-110 h-20 ${className}`} {...props}/>
            </>);
            case "loading":
                return(<>
                    <RefreshIcon className={`${className} h-20 animate-spin`} {...props}/>
                </>);
        default:
        break;
    }
}