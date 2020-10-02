import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import GridLayout, { Layout } from "react-grid-layout";
import { AvatarCard } from "./AvatarCardComponent";
import { YoutubeCard } from "./YoutubeCardComponent";
import EyeIcon from "./assets/eye.png";
import { isEqual } from "lodash";

interface UserInfo {
  name: string;
  id: string;
  peerId: string;
}
export interface AbstractCard {
  layout: GridLayout.Layout;
  title: string;
  icon: string;
  author: string;
  manager: string | null;
  trashed: boolean;
}

export type Card = YoutubeCard | AvatarCard;

interface IncrementTicker {
  kind: "increment_ticker";
}

interface AddToBackpack {
  kind: "add_to_backpack";
  card: Card;
}

interface AddFromBackpack {
  kind: "add_from_backpack";
  cardID: string;
}

interface ClearBackpack {
  kind: "clear_backpack";
}

interface SetCards {
  kind: "set_cards";
  cards: Card[];
}

interface SetBackpack {
  kind: "set_backpack";
  backpack: Card[];
}

interface SetReady {
  kind: "set_ready";
  myName: string;
}

interface AddPeer {
  kind: "add_peer";
  peer: UserInfo;
}

interface RemovePeer {
  kind: "remove_peer";
  peerId: string;
}

export type action =
  | SetCards
  | SetBackpack
  | AddToBackpack
  | ClearBackpack
  | AddFromBackpack
  | IncrementTicker
  | SetReady
  | AddPeer
  | RemovePeer;

export interface OverallState {
  cards: Card[];
  myBackpack: Card[];
  ticker: number;
  ready: boolean;
  peers: UserInfo[];
}

const saveBackpack = (backpack: Card[]) => {
  localStorage.setItem("myBackpack", JSON.stringify(backpack));
};

localStorage.setItem("log", "false");

export const gordonId = () => Math.random().toString(36).substr(2, 9);

class DataManager {
  ydoc: Y.Doc;
  provider?: WebrtcProvider;
  streamMap: any = {};
  me: UserInfo;
  peerMap: { [clientID: string]: UserInfo } = {};
  dispatch?: React.Dispatch<action>;
  myStream: any;
  cardsY: any;
  myAvatarID?: string;
  constructor() {
    this.ydoc = new Y.Doc();

    this.me = {
      id: this.ydoc.clientID.toString(),
      name: "",
      peerId: "",
    };
    this.setupWatchers();
  }
  connect = () => {
    const matched = window.location.hash.match(/#!([a-z0-9]+)-([a-z0-9]+)/);
    let roomId = gordonId();
    let pwd = gordonId();
    if (matched) {
      roomId = matched[1];
      pwd = matched[2];
    } else {
      window.location.hash = `!${roomId}-${pwd}`;
    }
    this.provider = new WebrtcProvider(roomId, this.ydoc, {
      password: pwd,
      signaling: [
        "wss://signaling.yjs.dev",
        "wss://y-webrtc-signaling-eu.herokuapp.com",
        "wss://y-webrtc-signaling-us.herokuapp.com",
      ],
      filterBcConns: false,
      maxConns: Number.POSITIVE_INFINITY,
      //   peerOpts: { initiator: matched === null, objectMode: false, streams: [] },
      peerOpts: { objectMode: false, streams: [] },
    } as any);
    this.setupStream();
  };
  setupWatchers = () => {
    this.cardsY = this.ydoc.getMap("cards");
    this.cardsY.observe((evt: any) => {
      if (this.dispatch) {
        this.dispatch({
          kind: "set_cards",
          cards: (Array.from(this.cardsY.values()) as Card[]).filter(
            (card) => !card.trashed
          ),
        });
      }
    });
  };
  setDispatch(dispatch: React.Dispatch<action>) {
    this.dispatch = dispatch;
  }
  incrementTicker = () => {
    if (this.dispatch) {
      this.dispatch({ kind: "increment_ticker" });
    }
  };
  addMyAvatar = async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.myStream = myStream;
    this.streamMap[this.me.peerId] = myStream;
    if (this.provider && this.provider.room) {
      this.provider.room.webrtcConns.forEach((conn) => {
        conn.peer.addStream(this.myStream);
        this.incrementTicker();
      });
    }
    const id = Math.random().toString();
    this.myAvatarID = id;
    // TODO: prevent from adding it twice
    this.addCard({
      kind: "avatar",
      title: this.me.name,
      icon: EyeIcon,
      layout: { x: 0, y: 0, i: id, w: 2, h: 2 },
      author: this.me.id,
      manager: this.me.id,
      trashed: false,
    });
  };
  setupStream = async () => {
    try {
      this.provider!.on("peers", async (e: any) => {
        if (this.provider!.room && this.me.peerId === "" && this.dispatch) {
          this.me.peerId = this.provider!.room.peerId;
          this.peerMap[this.me.id] = this.me;
        }
        e.removed.forEach((peerId: string) => {
          console.log(`${peerId} left`);
          this.dispatch!({ kind: "remove_peer", peerId });
        });
        e.added.forEach((peerId: string) => {
          if (!this.provider!.room) {
            return;
          }
          const conn = this.provider!.room.webrtcConns.get(peerId);
          if (!conn) {
            return;
          }
          const peer = conn.peer;
          if (peer) {
            peer.on("data", async (data: any) => {
              const stringified = data.toString();
              if (stringified.length > 0 && stringified.match(/packetKind/)) {
                const parsed = JSON.parse(stringified);
                const id = parsed.docID.toString();
                if (!this.peerMap[id]) {
                  const newPeer = {
                    name: parsed.myName,
                    id,
                    peerId,
                  };
                  this.peerMap[id] = newPeer;
                  this.dispatch!({ kind: "add_peer", peer: newPeer });
                  peer.send(
                    JSON.stringify({
                      packetKind: "ID",
                      docID: this.me.id,
                      myName: this.me.name,
                    })
                  );
                  if (this.myStream) {
                    peer.addStream(this.myStream);
                    this.incrementTicker();
                  }
                }
              }
            });
            peer.on("stream", async (stream: any) => {
              console.log("stream", stream);
              this.streamMap[peerId] = stream;
              this.incrementTicker();
            });

            peer.on("connect", () => {
              peer.send(
                JSON.stringify({
                  packetKind: "ID",
                  docID: this.me.id,
                  myName: this.me.name,
                })
              );
            });
          }
        });
      });
    } catch (err) {
      console.log("error", err);
    }
  };
  defaultMe = (): OverallState => {
    return {
      cards: Array.from(this.cardsY.values()).filter(
        (card: any) => !card.trashed
      ) as Card[],
      myBackpack: [],
      ticker: 1,
      ready: false,
      peers: [],
    };
  };
  updateLayouts = (layouts: Layout[]) => {
    layouts.forEach((layout: Layout) => {
      const old = this.cardsY.get(layout.i);
      if (!isEqual(old.layout, layout)) {
        // const { w, h } = layout;
        // if (Math.abs(h - w) > 3) {
        //   // for some reason doesnt work immutably
        //   card.layout.h = Math.min(w, h);
        //   card.layout.w = Math.min(w, h);
        //   return card;
        this.cardsY.set(layout.i, {
          ...old,
          layout: JSON.parse(JSON.stringify(layout)),
        });
      }
    });
  };

  addCard = (card: Card) => {
    this.cardsY.set(card.layout.i, card);
  };
  updateCard = (card: Card) => {
    this.cardsY.set(card.layout.i, card);
    if (card.author === this.me.id && card.trashed && card.kind === "avatar") {
      if (this.provider && this.provider.room) {
        this.provider.room.webrtcConns.forEach((conn) => {
          //   conn.peer.removeStream(this.myStream);
        });
      }
      this.myStream.getTracks().forEach((stream: any) => {
        stream.stop();
      });
    }
  };

  addFromBackpack = (card: Card) => {
    if (this.dispatch) {
      this.dispatch({ kind: "add_from_backpack", cardID: card.layout.i });
      this.cardsY.set(card.layout.i, card);
    }
  };
  setNameAndConnect = (name: string) => {
    this.me.name = name;
    this.dispatch!({ kind: "set_ready", myName: name });
    this.connect();
  };

  reducer = (state: OverallState, action: action): OverallState => {
    let newBackpack;
    let newState;
    switch (action.kind) {
      case "set_cards":
        return { ...state, cards: action.cards };
      case "set_backpack":
        saveBackpack(action.backpack);
        return { ...state, myBackpack: action.backpack };
      case "add_to_backpack":
        let newCard = { ...action.card };
        if (newCard.kind === "youtube") {
          newCard.state = { ...newCard.state, playing: false };
        }
        if (
          state.myBackpack.some((card) => card.layout.i === newCard.layout.i)
        ) {
          newBackpack = state.myBackpack.map((card) =>
            card.layout.i === newCard.layout.i ? newCard : card
          );
        } else {
          newBackpack = [...state.myBackpack, newCard];
        }
        saveBackpack(newBackpack);
        return { ...state, myBackpack: newBackpack };
      case "clear_backpack":
        newState = { ...state, myBackpack: [] };
        saveBackpack([]);
        return newState;
      case "add_from_backpack":
        newBackpack = state.myBackpack.filter(
          (card) => card.layout.i !== action.cardID
        );
        saveBackpack(newBackpack);
        return { ...state, myBackpack: newBackpack };
      case "increment_ticker":
        return { ...state, ticker: state.ticker + 1 };
      case "set_ready":
        return { ...state, ready: true, peers: [...state.peers, this.me] };
      case "add_peer":
        return { ...state, peers: [...state.peers, action.peer] };
      case "remove_peer":
        return {
          ...state,
          peers: state.peers.filter((peer) => peer.peerId !== action.peerId),
        };
    }
  };
}

export default DataManager;
