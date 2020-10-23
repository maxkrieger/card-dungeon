import React, { useCallback } from "react";
import { useRef, useState } from "react";
import { dispatcher } from "./App";
import { Card } from "./DataManager";
import CardsEye from "./assets/cardseye.png";
import { AvatarCardData } from "./cards/AvatarCardComponent";
import { QuillCardData } from "./cards/QuillCardComponent";
import { YoutubeCardData } from "./cards/YoutubeCardComponent";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";

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
];

const CardPicker: React.FC<{ dispatch: dispatcher }> = ({ dispatch }) => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);
  const closePicker = useCallback(() => {
    setOpen(false);
    setSelectedCard(-1);
  }, []);
  const onPicked = useCallback((key: number) => {
    const option = PickerOptions[key];
    if (option.picker) {
      setSelectedCard(key);
    } else if (option.onPick) {
      option.onPick();
      setOpen(false);
    }
  }, []);

  return (
    <div style={{ zIndex: 10000 }}>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          width: "98px",
          height: "144px",
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
            height: "70vh",
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
                    width: "100px",
                    height: "150px",
                    margin: "1em",
                    background: `url(${icon})`,
                    backgroundSize: "cover",
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
