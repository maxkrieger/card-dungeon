import React, { useRef, useEffect } from "react";
import { dataManager } from "./App";
import { AbstractCard } from "./DataManager";

export interface AvatarCard extends AbstractCard {
  kind: "avatar";
  updateTicker: number;
}
const AvatarCardComponent: React.FC<{ card: AvatarCard }> = ({ card }) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoElement) {
      console.log("no video yet");
      return;
    }
    let video = videoElement.current;
    if (!video) {
      console.log("no video yet2");
      return;
    }
    const stream = dataManager.streamMap[card.author];
    video.srcObject = stream;
    (async () => {
      await video.play();
      console.log("playing", card.author, "me", dataManager.me.peerId);
      if (card.author === dataManager.me.peerId) {
        video.muted = true;
      }
    })();
  }, [videoElement, card.author, card.updateTicker]);
  return (
    <video
      ref={videoElement}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
};

export default AvatarCardComponent;
