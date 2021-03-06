import React, { useRef, useEffect, useCallback } from "react";
import { dataManager } from "../App";
import { AbstractCard, gordonId } from "../DataManager";
import ReactQuill from "react-quill";
import { QuillBinding } from "y-quill";
import "react-quill/dist/quill.bubble.css";
import QuillCardIcon from "../assets/card_animated/textcard.gif";
import QuillLibIcon from "../assets/quilllibicon.png";
import { PickerProps, CardPickerData } from "../CardPicker";
import QuillCursors from "quill-cursors";
import { Quill } from "react-quill";
import TextBorder from "../assets/textborder.png";

Quill.register("modules/cursors", QuillCursors);

export interface QuillCard extends AbstractCard {
  kind: "quill";
  textID: string;
  initialText: string;
}

export const QuillCardData: CardPickerData = {
  icon: QuillCardIcon,
  onPick: () => {
    const { id, name } = dataManager.getMe();
    dataManager.addCard({
      kind: "quill",
      textID: gordonId(),
      initialText: "",
      author: id,
      manager: id,
      title: `${name}'s text`,
      icon: QuillLibIcon,
      x: 0,
      y: 0,
      w: 300,
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
        backgroundImage: `url(${TextBorder})`,
        backgroundRepeat: "repeat",
      }}
    >
      <ReactQuill
        theme={"bubble"}
        ref={quillRef}
        modules={{
          cursors: true,
          history: {
            userOnly: true,
          },
        }}
        placeholder={"begin your incantations"}
        style={{ height: "100%", overflow: "hidden" }}
      />
    </div>
  );
};

export default QuillCardComponent;
