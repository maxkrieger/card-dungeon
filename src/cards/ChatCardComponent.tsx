import React, { useRef, useEffect, useCallback } from "react";
import { CardPickerData } from "../CardPicker";
import { AbstractCard, gordonId } from "../DataManager";
import ChatCardIcon from "../assets/card_animated/chatcard.gif";
import ChatIcon from "../assets/chaticon.png";
import { dataManager } from "../App";

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
  return <div />;
};

export default ChatCardComponent;
