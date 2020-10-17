import React from "react";
import { useRef, useState } from "react";
import { dispatcher } from "./App";
import { Card } from "./DataManager";
import CardsEye from "./assets/cardseye.png";
import { AvatarCardData } from "./cards/AvatarCardComponent";
import { QuillCardData } from "./cards/QuillCardComponent";
import { YoutubeCardData } from "./cards/YoutubeCardComponent";

export type PickerProps = { dispatch: dispatcher };

export type CardPickerData = {
  icon: string;
  picker: React.FunctionComponent<PickerProps>;
};

const PickerOptions: CardPickerData[] = [
  AvatarCardData,
  QuillCardData,
  YoutubeCardData,
];

const CardPicker: React.FC<{ dispatch: dispatcher }> = ({ dispatch }) => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);
  if (!open) {
    return (
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
        }}
        onClick={() => setOpen(true)}
      />
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
      onClick={() => setOpen(false)}
    >
      {selectedCard < 0 &&
        PickerOptions.map(({ icon }, key: number) => (
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
              setSelectedCard(key);
              return false;
            }}
          />
        ))}
      {selectedCard >= 0 && (
        <div>{PickerOptions[selectedCard].picker({ dispatch })}</div>
      )}
    </div>
  );
};

export default CardPicker;
