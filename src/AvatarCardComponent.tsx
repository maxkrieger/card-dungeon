import React, { useRef, useEffect, useCallback } from "react";
import { dataManager } from "./App";
import { AbstractCard, action } from "./DataManager";

export interface AvatarCard extends AbstractCard {
  kind: "avatar";
}

export interface AvatarCardProps {
  card: AvatarCard;
  ticker: number;
}

const AvatarCardComponent: React.FC<AvatarCardProps> = ({ card, ticker }) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const stream =
    card.author === dataManager.me.id
      ? dataManager.myStream
      : dataManager.peerMap[card.author]
      ? dataManager.streamMap[dataManager.peerMap[card.author].peerId]
      : undefined;
  const onRefReady = useCallback(() => {
    let video = videoElement.current;
    if (!video) {
      console.log("no video yet2", ticker);
      return;
    }

    (async () => {
      if (video.paused && stream) {
        video.srcObject = stream;
        await video.play();
      }
      if (card.author === dataManager.me.id) {
        video.muted = true;
      }
    })();
  }, [videoElement, card, ticker, stream]);
  useEffect(() => {
    if (!videoElement) {
      console.log("no video yet");
      return;
    }
    onRefReady();
  }, [videoElement, onRefReady, ticker]);
  return (
    <div>
      <video
        ref={videoElement}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {stream === undefined && "no stream"}
    </div>
  );
};

export default AvatarCardComponent;