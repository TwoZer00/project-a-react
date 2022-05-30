import { stringToDate } from "../../utils/utils";

export function PostDetails({title,username,desc,creationTime,profileImage,audioURL,handleURL}){
    console.log(title);
    //console.log(stringToDate(creationTime));
    const handleClick = (e)=>{
        e.preventDefault();
        console.log(audioURL);
    }
    return(
        <div className="m-2">
            <div className="border flex flex-col-reverse lg:flex-row place-items-center w-full lg:w-5/6 lg:mx-auto ">
                <div className="flex-auto w-full lg:w-2/3 text-center">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="">{stringToDate(creationTime)}</p>
                    <p>{username}</p>
                    <p className="">{desc}</p>
                    <button className="bg-purple-500 text-white rounded-full px-1" onClick={handleClick}>Listen audio</button>
                </div>
                <div className="flex-auto w-full lg:w-1/3 bg-purple-100 p-5">
                    <div className="max-h-52 max-w-52 h-52 w-52 bg-purple-700 rounded-full mx-auto">
                        <img src={profileImage} alt="" className="p-5 h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}