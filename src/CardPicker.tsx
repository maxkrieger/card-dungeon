import React, { useCallback } from "react";
import { useRef, useState } from "react";
import { dispatcher } from "./App";
import { Card } from "./DataManager";
import CardsEye from "./assets/cardseye.png";
import { AvatarCardData } from "./cards/AvatarCardComponent";
import { QuillCardData } from "./cards/QuillCardComponent";
import { YoutubeCardData } from "./cards/YoutubeCardComponent";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { ImageCardData } from "./cards/ImageCardComponent";
import { ChatCardData } from "./cards/ChatCardComponent";
import useSound from "use-sound";
import CardSfx from "./assets/card.mp3";
import { random } from "lodash";

export type PickerProps = { dispatch: dispatcher; onClose(): void };

export type CardPickerData = {
  icon: string;
  picker?: React.FunctionComponent<PickerProps>;
  onPick?: () => void;
};

const PickerOptions: CardPickerData[] = [
  AvatarCardData,
  QuillCardData,
  YoutubeCardData,
  ImageCardData,
  ChatCardData,
];

const CardPicker: React.FC<{ dispatch: dispatcher }> = ({ dispatch }) => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [play] = useSound(CardSfx, {
    sprite: {
      1: [0, 600],
      2: [1947, 400],
      3: [3821, 400],
      4: [5555, 400],
      5: [7247, 300],
    },
  });
  const closePicker = useCallback(() => {
    setOpen(false);
    setSelectedCard(-1);
    play({ id: random(1, 5).toString() });
  }, [play]);
  const onPicked = useCallback(
    (key: number) => {
      const option = PickerOptions[key];
      if (option.picker) {
        setSelectedCard(key);
      } else if (option.onPick) {
        option.onPick();
        closePicker();
      }
    },
    [closePicker]
  );

  return (
    <div style={{ zIndex: 10000 }}>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          width: "110px",
          height: "162px",
          background: `url(${CardsEye})`,
          backgroundSize: "cover",
          cursor: "pointer",
          boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
          display: open ? "none" : "block",
        }}
        onClick={() => setOpen(true)}
      />
      <DialogOverlay
        style={{ background: "rgba(0,0,0,0.3)" }}
        isOpen={open}
        onDismiss={closePicker}
      >
        <DialogContent
          style={{
            padding: 0,
            maxWidth: "75vw",
            minWidth: "500px",
            display: "flex",
            flexDirection: "column",
            background: "none",
          }}
          aria-label="spell card picker"
        >
          {selectedCard < 0 && (
            <div style={{ zIndex: 200 }}>
              {PickerOptions.map(({ icon }, key: number) => (
                <div
                  key={key}
                  style={{
                    width: "125px",
                    height: "187.5px",
                    margin: "1em",
                    backgroundImage: `url(${icon})`,
                    backgroundSize: "cover",
                    borderRadius: "10px",
                    display: "inline-block",
                  }}
                  onClick={() => {
                    onPicked(key);
                  }}
                />
              ))}
            </div>
          )}
          {PickerOptions.map(({ picker }: CardPickerData, idx: number) => (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: selectedCard === idx ? "block" : "none",
              }}
              key={idx}
            >
              {picker && picker({ dispatch, onClose: closePicker })}
            </div>
          ))}
        </DialogContent>
      </DialogOverlay>
    </div>
  );
};

export default CardPicker;
