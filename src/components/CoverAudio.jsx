import React from "react";

export default function CoverAudio({ src }) {
  return (
    <img src={src} alt="coverAudio" className="w-full h-full object-cover" />
  );
}
