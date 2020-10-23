import React, { useRef, useEffect, useCallback } from "react";
import { dataManager } from "../App";
import { AbstractCard, gordonId } from "../DataManager";
import ReactQuill from "react-quill";
import { QuillBinding } from "y-quill";
import "react-quill/dist/quill.snow.css";
import QuillCardIcon from "../assets/quillcard.png";
import { PickerProps, CardPickerData } from "../CardPicker";

export interface QuillCard extends AbstractCard {
  kind: "quill";
  textID: string;
}

export const QuillCardData: CardPickerData = {
  icon: QuillCardIcon,
  onPick: () => {
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
  },
};

const QuillCardComponent: React.FC<{ card: QuillCard }> = ({ card }) => {
  const quillRef = useRef<ReactQuill>(null);
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const type = dataManager.ydoc.getText(card.textID);
      const binding = new QuillBinding(type, editor, dataManager.awareness);
    }
  }, [quillRef, card.textID]);
  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        flexGrow: 1,
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      <ReactQuill
        theme="snow"
        ref={quillRef}
        // modules={{ cursors: true }}
        placeholder={"begin your incantations"}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default QuillCardComponent;
