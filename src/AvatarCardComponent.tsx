import React, { useRef, useEffect } from "react";
import { AbstractCard } from "./App";

export interface AvatarCard extends AbstractCard {
  kind: "avatar";
}
const AvatarCardComponent: React.FC<{ card: AvatarCard }> = ({ card }) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoElement) {
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      let video = videoElement.current;
      if (!video) {
        return;
      }
      video.srcObject = stream;
      video.play();
    });
  }, [videoElement]);
  return (
    <video ref={videoElement} style={{ width: "100%", objectFit: "contain" }} />
  );
};

export default AvatarCardComponent;
