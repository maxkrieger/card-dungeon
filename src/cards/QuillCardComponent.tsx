import React, { useRef, useEffect, useCallback } from "react";
import { dataManager } from "../App";
import { AbstractCard, gordonId } from "../DataManager";

import QuillCardIcon from "../assets/textimages/text_0000.png";
import QuillLibIcon from "../assets/quilllibicon.png";
import { PickerProps, CardPickerData } from "../CardPicker";

import { schema } from "../pm-schema";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from "y-prosemirror";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";
import { keymap } from "prosemirror-keymap";

import "../prosemirror.css";

export interface QuillCard extends AbstractCard {
  kind: "quill";
  textID: string;
  initialText: any[];
}

export const QuillCardData: CardPickerData = {
  icon: QuillCardIcon,
  onPick: () => {
    dataManager.addCard({
      kind: "quill",
      textID: gordonId(),
      initialText: [],
      author: dataManager.getMe().id,
      manager: dataManager.getMe().id,
      title: "text",
      icon: QuillLibIcon,
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
  const viewHost = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewHost.current) {
      console.log("ye");
      const type = dataManager.ydoc.getXmlFragment(card.textID);
      new EditorView(viewHost.current, {
        state: EditorState.create({
          schema,
          plugins: [
            ySyncPlugin(type),
            yCursorPlugin(dataManager.awareness),
            yUndoPlugin(),
            keymap({
              "Mod-z": undo,
              "Mod-y": redo,
              "Mod-Shift-z": redo,
            }),
          ].concat(exampleSetup({ schema })),
        }),
      });
    }
  }, [viewHost, card]);

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
      <div ref={viewHost} />
    </div>
  );
};

export default QuillCardComponent;
