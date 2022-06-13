import { PauseIcon, PlayIcon, RefreshIcon } from "@heroicons/react/solid";

export function PlayButton({state,className,...props}){
    switch(state){
        case "playing":
            return(<>
                <PauseIcon className={`transition-all ${className} hover:scale-110`} {...props} />
                {/* {
                                        !audioElement.current?.paused?():
                                    } */}
            </>);
        case "paused":
            return(<>
                <PlayIcon className={`transition-all hover:scale-110 ${className}`} {...props}/>
            </>);
            case "loading":
                return(<>
                    <RefreshIcon className={`${className} animate-spin`} {...props}/>
                </>);
        default:
        break;
    }
}