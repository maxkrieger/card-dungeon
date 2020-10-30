import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { dataManager } from "./App";
import BackpackIcon from "./assets/backpack.png";
import TextBorder from "./assets/textborder.png";
import FrameBorder from "./assets/border.png";
import { Card, action } from "./DataManager";
import { BORDER_PRIMARY_COLOR, BORDER_SECONDARY_COLOR } from "./colors";
import { truncate } from "lodash";

const BackpackComponent: React.FC<{
  backpack: Card[];
  show: boolean;
  onClose(): void;
  dispatch: React.Dispatch<action>;
}> = ({ show, onClose, dispatch, backpack }) => {
  // const clearBackpack = useCallback(() => {
  //   dispatch({ kind: "clear_backpack" });
  // }, [dispatch]);
  const removeFromBackpack = useCallback(
    (card: Card) => {
      dispatch({ kind: "remove_from_backpack", card });
    },
    [dispatch]
  );
  const addFrom = useCallback(
    (card: Card) => {
      dataManager.addFromBackpack(card);
    },
    [dispatch]
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
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          backgroundImage: `url(${TextBorder})`,
          userSelect: "none",
          // backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
        aria-label="spell picker"
      >
        <div
          style={{
            flexShrink: 0,
            fontFamily: `"Alagard"`,
            fontSize: "18px",
            backgroundColor: "#C39B77",
            backgroundImage: `url(${FrameBorder})`,
            backgroundRepeat: "repeat",
            userSelect: "none",
            display: "flex",
            justifyContent: "space-between",
            color: BORDER_PRIMARY_COLOR,
          }}
        >
          <img
            src={BackpackIcon}
            width={30}
            style={{ verticalAlign: "middle" }}
          />
          <span>backpack</span>
          <button
            style={{
              fontFamily: "Alagard",
              color: "#FFFFFF",
              backgroundColor: BORDER_SECONDARY_COLOR,
              border: `0.8px solid ${BORDER_PRIMARY_COLOR}`,
              borderRadius: "5px",
            }}
            onClick={onClose}
          >
            x
          </button>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            flexGrow: 1,
            position: "relative",
          }}
        >
          {backpack.length === 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%)`,
              }}
            >
              backpack is empty
            </div>
          )}
          {backpack.map((card: Card, key: number) => (
            <div
              style={{
                margin: "5px",
                display: "inline-block",
              }}
              key={key}
            >
              <button
                style={{
                  fontFamily: "Alagard",
                  color: "#FFFFFF",
                  backgroundColor: BORDER_SECONDARY_COLOR,
                  border: `0.8px solid ${BORDER_PRIMARY_COLOR}`,
                  borderRadius: "5px",
                }}
                onClick={() => removeFromBackpack(card)}
              >
                x
              </button>
              <div
                style={{
                  margin: "10px",
                  backgroundColor: BORDER_SECONDARY_COLOR,
                  borderRadius: "5px",
                  color: BORDER_PRIMARY_COLOR,
                  width: "100px",
                  height: "75px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "5px 5px 5px hsla(0, 0%, 0%, 0.5)",
                }}
                onClick={() => addFrom(card)}
              >
                <div
                  style={{
                    flexGrow: 1,
                    flexShrink: 0,
                    backgroundImage: `url(${
                      card.kind === "image" ? card.uri : card.icon
                    })`,
                    backgroundColor: "transparent",
                    backgroundSize: "fit",
                    backgroundRepeat: "no-repeat",
                    height: "100%",
                  }}
                />

                <div>
                  {card.title}{" "}
                  {card.kind === "quill" &&
                    truncate(card.initialText, { length: 10 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </DialogOverlay>
  );
};

export default BackpackComponent;
