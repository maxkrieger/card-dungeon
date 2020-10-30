import React, { useRef, useEffect, useCallback } from "react";
import { CardPickerData } from "../CardPicker";
import { AbstractCard, gordonId } from "../DataManager";
import ChatCardIcon from "../assets/card_animated/chatcard.gif";
import ChatIcon from "../assets/chaticon.png";
import { dataManager } from "../App";
import TextInputForm from "../TextInputForm";
import { BORDER_PRIMARY_COLOR, BORDER_SECONDARY_COLOR } from "../colors";
import BG from "../assets/sandy.png";
import OrbIcon from "../assets/orb.png";

import pet1 from "../assets/pet/pet1.gif";
import pet2 from "../assets/pet/pet2.gif";
import pet3 from "../assets/pet/pet3.gif";
import pet4 from "../assets/pet/pet4.gif";
import grey_right from "../assets/pet/dog-grey-right.gif";
import grey_left from "../assets/pet/dog-grey-left.gif";
import grey_down from "../assets/pet/dog-grey-down.gif";
import black_right from "../assets/pet/dog-black-right.gif";
import black_left from "../assets/pet/dog-black-left.gif";
import black_down from "../assets/pet/dog-black-down.gif";
import yellow_right from "../assets/pet/dog-yellow-right.gif";
import yellow_left from "../assets/pet/dog-yellow-left.gif";
import yellow_down from "../assets/pet/dog-yellow-down.gif";
import { random, truncate } from "lodash";

const PETS = [
  pet1,
  pet2,
  pet3,
  pet4,
  grey_right,
  grey_left,
  grey_down,
  black_right,
  black_left,
  black_down,
  yellow_right,
  yellow_left,
  yellow_down,
];

interface ChatMessage {
  author: string;
  authorName: string;
  time: number;
  text: string;
  pet: number;
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
      if (message.match("pet")) {
      }
      const msg: ChatMessage = {
        author: dataManager.getMe().id,
        authorName: dataManager.getMe().name,
        time: new Date().getTime(),
        text: message,
        pet: message.match("pet") ? random(0, PETS.length - 1) : -1,
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
            style={{
              width: "100%",
              wordWrap: "break-word",
              margin: "3px",
              verticalAlign: "middle",
            }}
          >
            <span
              style={{
                color: chat.author === id ? "darkblue" : "darkgreen",
              }}
            >
              {chat.author === id && <img src={OrbIcon} width={"15px"} />}{" "}
              {truncate(chat.authorName, { length: 15 })}:
            </span>{" "}
            <span
              style={{
                color: BORDER_SECONDARY_COLOR,
              }}
            >
              {chat.text}{" "}
              {chat.pet !== -1 && <img src={PETS[chat.pet]} width={"20px"} />}
            </span>
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
