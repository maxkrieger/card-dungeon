import React, { useRef, useEffect, useCallback } from "react";
import { dataManager, dispatcher } from "../App";
import { CardPickerData, PickerProps } from "../CardPicker";
import { AbstractCard, action } from "../DataManager";
import MeCard from "../assets/mecard.png";

export interface AvatarCard extends AbstractCard {
  kind: "avatar";
}

export interface AvatarCardProps {
  card: AvatarCard;
  ticker: number;
}

export const AvatarCardPicker: React.FC<PickerProps> = ({ dispatch }) => {
  return <div>hi im avatar</div>;
};

export const AvatarCardData: CardPickerData = {
  icon: MeCard,
  picker: AvatarCardPicker,
};

const AvatarCardComponent: React.FC<AvatarCardProps> = ({ card, ticker }) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const peers = dataManager.awareness.getStates();
  const authorString = parseInt(card.author, 10);
  const stream =
    card.author === dataManager.getMe().id
      ? dataManager.myStream
      : peers.has(authorString)
      ? dataManager.streamMap[(peers.get(authorString) as any).peerId]
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
      if (card.author === dataManager.getMe().id) {
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
