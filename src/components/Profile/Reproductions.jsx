import { ChartBarIcon } from "@heroicons/react/outline";
import { optimize } from "../../utils/utils";

export default function Reproductions({counter,...props}){
    let optimezeCounter = optimize(counter);
    return(
        <div {...props}>
            Reproductions
            <p className="text-lg leading-none pr-1 align-middle">{optimezeCounter}</p>
        </div>
    );
}