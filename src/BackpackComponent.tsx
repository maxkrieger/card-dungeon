import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { action, BORDER_PRIMARY_COLOR, Card } from "./App";
import YoutubeIcon from "./assets/youtube.png";
import BackpackIcon from "./assets/backpack.png";

enum Primaries {
  YOUTUBE,
  NONE,
}

const ColStyle = {
  overflow: "scroll",
  borderRight: "1px solid black",
  maxWidth: "300px",
  flexBasis: "200px",
};

const BackpackComponent: React.FC<{
  backpack: Card[];
  show: boolean;
  onClose(): void;
  dispatch: React.Dispatch<action>;
}> = ({ show, onClose, dispatch, backpack }) => {
  const [primaryOpen, setPrimaryOpen] = useState<Primaries>(Primaries.NONE);
  const clearBackpack = useCallback(() => {
    dispatch({ kind: "clear_backpack" });
  }, [dispatch]);
  const addFrom = useCallback(
    (cardID: string) => {
      dispatch({ kind: "add_from_backpack", cardID });
    },
    [dispatch]
  );
  const youtubes = backpack.filter((card) => card.kind === "youtube");
  return (
    <DialogOverlay
      style={{ background: "none" }}
      isOpen={show}
      onDismiss={onClose}
    >
      <DialogContent
        style={{
          boxShadow: "10px 10px hsla(0, 0%, 0%, 0.5)",
          fontFamily: `"Alagard"`,
          padding: 0,
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
        }}
        aria-label="spell picker"
      >
        <div
          style={{
            width: "100%",
            backgroundColor: BORDER_PRIMARY_COLOR,
            userSelect: "none",
          }}
        >
          <img
            src={BackpackIcon}
            width={30}
            style={{ verticalAlign: "middle" }}
          />
          <span>backpack</span>
          <button onClick={onClose}>x</button>
          <button onClick={clearBackpack}>clear</button>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            overflow: "hidden",
            alignItems: "stretch",
            flexGrow: 1,
          }}
        >
          <div style={ColStyle}>
            <div
              style={
                primaryOpen === Primaries.YOUTUBE
                  ? { color: "#FFFFFF", backgroundColor: "#000000" }
                  : { color: "#000000", backgroundColor: "#FFFFFF" }
              }
              onClick={() => setPrimaryOpen(Primaries.YOUTUBE)}
            >
              <img src={YoutubeIcon} width={30} /> youtube ({youtubes.length})
              {" >"}
            </div>
          </div>
          <div style={ColStyle}>
            {primaryOpen === Primaries.YOUTUBE ? (
              <div>
                {youtubes.map((card) => (
                  <div
                    key={card.layout.i}
                    style={{ cursor: "pointer", margin: "10px" }}
                    onClick={() => addFrom(card.layout.i)}
                  >
                    {card.title}
                  </div>
                ))}
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
};

export default BackpackComponent;
