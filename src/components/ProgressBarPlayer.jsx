import React from "react";

export default function ProgressBarPlayer({ progress, onclick, reference }) {
  return (
    <div className="bg-purple-300 w-full h-full relative" ref={reference}>
      <div className={`bg-purple-600 w-[${progress}%] h-full`}></div>
    </div>
  );
}
