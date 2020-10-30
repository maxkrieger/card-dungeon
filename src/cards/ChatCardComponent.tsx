import React, { useRef, useEffect, useCallback } from "react";
import { CardPickerData } from "../CardPicker";
import { AbstractCard, gordonId } from "../DataManager";
import ChatCardIcon from "../assets/card_animated/chatcard.gif";
import ChatIcon from "../assets/chaticon.png";
import { dataManager } from "../App";
import TextInputForm from "../TextInputForm";
import { BORDER_PRIMARY_COLOR, BORDER_SECONDARY_COLOR } from "../colors";
import BG from "../assets/sandy.png";

interface ChatMessage {
  author: string;
  authorName: string;
  time: number;
  text: string;
}

export interface ChatCard extends AbstractCard {
  kind: "chat";
  chats: ChatMessage[];
}

export const ChatCardData: CardPickerData = {
  icon: ChatCardIcon,
  onPick: () => {
    dataManager.addCard({
      kind: "chat",
      chats: [],
      author: dataManager.getMe().id,
      manager: dataManager.getMe().id,
      title: `${dataManager.getMe().name}'s chat`,
      icon: ChatIcon,
      x: 0,
      y: 0,
      w: 300,
      h: 300,
      id: gordonId(),
      trashed: false,
    });
  },
};

const ChatCardComponent: React.FC<{ card: ChatCard }> = ({ card }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const onSend = useCallback(
    (message: string) => {
      const msg: ChatMessage = {
        author: dataManager.getMe().id,
        authorName: dataManager.getMe().name,
        time: new Date().getTime(),
        text: message,
      };
      dataManager.updateCard({ ...card, chats: [...card.chats, msg] });
    },
    [card]
  );
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  });
  const { id } = dataManager.getMe();
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        flexDirection: "column",
        backgroundImage: `url(${BG})`,
        backgroundRepeat: "repeat",
        padding: "5px",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          overflow: "auto",
          width: "100%",
          fontFamily: "Alagard",
          padding: "10px",
        }}
        ref={chatRef}
      >
        {card.chats.map((chat: ChatMessage, key: number) => (
          <div
            key={key}
            style={{ width: "100%", wordWrap: "break-word", margin: "3px" }}
          >
            <span
              style={{ color: chat.author === id ? "darkblue" : "darkgreen" }}
            >
              {chat.authorName}:
            </span>{" "}
            <span style={{ color: BORDER_SECONDARY_COLOR }}>{chat.text}</span>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, padding: "10px" }}>
        <TextInputForm
          onSubmit={onSend}
          small={true}
          maxLength={300}
          regex={null}
          placeholder={"type your chat message"}
        />
      </div>
    </div>
  );
};

export default ChatCardComponent;
