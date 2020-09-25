import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { action } from "./App";
import YoutubeIcon from "./assets/youtube.png";

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

const SpellPicker: React.FC<{
  show: boolean;
  onClose(): void;
  dispatch: React.Dispatch<action>;
}> = ({ show, onClose, dispatch }) => {
  const [primaryOpen, setPrimaryOpen] = useState<Primaries>(Primaries.NONE);
  const [mainFieldVal, setMainFieldVal] = useState("");
  const dispatchYT = useCallback(
    (e: any) => {
      e.preventDefault();
      dispatch({
        kind: "add_card",
        card: {
          kind: "youtube",
          title: "video",
          icon: YoutubeIcon,
          uri: mainFieldVal,
          layout: { x: 0, y: 0, i: Math.random().toString(), w: 2, h: 1 },
        },
      });
      onClose();
      setMainFieldVal("");
    },
    [dispatch, mainFieldVal, onClose]
  );
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
      >
        <div style={{ width: "100%", backgroundColor: "#C39B77" }}>
          spells
          <button onClick={onClose}>x</button>
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
              <img src={YoutubeIcon} width={30} /> youtube {">"}
            </div>
          </div>
          <div style={ColStyle}>
            {primaryOpen === Primaries.YOUTUBE ? (
              <div>
                <form onSubmit={dispatchYT}>
                  <input
                    type="url"
                    value={mainFieldVal}
                    onChange={(e: React.ChangeEvent<any>) => {
                      setMainFieldVal(e.target.value);
                    }}
                    placeholder={"youtube url..."}
                    autoFocus={true}
                  />
                  <input type="submit" value="cast!" />
                </form>
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

export default SpellPicker;
