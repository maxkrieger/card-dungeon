import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { BORDER_PRIMARY_COLOR, dataManager } from "./App";
import Orb from "./assets/orb.png";
import YoutubeIcon from "./assets/youtube.png";
import { YoutubeWizard } from "./cards/YoutubeCardComponent";
import { action, gordonId } from "./DataManager";
import EyeIcon from "./assets/eye.png";

enum Primaries {
  YOUTUBE,
  NONE,
}

export interface SpellPickerProps {
  dispatch: React.Dispatch<action>;
  onClose(): void;
}

const ColStyle = {
  overflow: "auto",
  borderRight: "1px solid black",
  maxWidth: "250px",
  flexBasis: "250px",
};

const SpellPicker: React.FC<{
  show: boolean;
  onClose(): void;
  dispatch: React.Dispatch<action>;
}> = ({ show, onClose, dispatch }) => {
  const [primaryOpen, setPrimaryOpen] = useState<Primaries>(Primaries.NONE);
  const addText = useCallback(() => {
    dataManager.addCard({
      kind: "quill",
      textID: gordonId(),
      author: dataManager.getMe().id,
      manager: dataManager.getMe().id,
      title: "text",
      icon: "",
      x: 0,
      y: 0,
      w: 200,
      h: 400,
      id: gordonId(),
      trashed: false,
    });
    onClose();
  }, [onClose]);
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
          height: "70vh",
          maxWidth: "75vw",
          minWidth: "500px",
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
          <img src={Orb} width={25} />
          spells
          {/* <button onClick={onClose}>x</button> */}
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
                  ? {
                      color: "#FFFFFF",
                      backgroundColor: "#000000",
                      verticalAlign: "middle",
                    }
                  : {
                      color: "#000000",
                      backgroundColor: "#FFFFFF",
                      verticalAlign: "middle",
                    }
              }
              onClick={() => setPrimaryOpen(Primaries.YOUTUBE)}
            >
              <img src={YoutubeIcon} width={30} /> youtube {">"}
            </div>
            <div
              onClick={() => {
                dataManager.addMyAvatar();
                onClose();
              }}
              style={{ verticalAlign: "middle" }}
            >
              <img src={EyeIcon} width={30} /> me
            </div>
            <div onClick={addText}>{"✒️"} ️text</div>
          </div>
          {primaryOpen === Primaries.YOUTUBE && (
            <YoutubeWizard onClose={onClose} dispatch={dispatch} />
          )}
        </div>
      </DialogContent>
    </DialogOverlay>
  );
};

export default SpellPicker;
