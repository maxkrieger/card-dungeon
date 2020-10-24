import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { AvatarCard } from "./cards/AvatarCardComponent";
import { YoutubeCard } from "./cards/YoutubeCardComponent";
import EyeIcon from "./assets/eye.png";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { QuillCard } from "./cards/QuillCardComponent";
import { debounce, min } from "lodash";
import { ImageCard } from "./cards/ImageCardComponent";

interface CursorPosition {
  x: number;
  y: number;
}

interface UserInfo {
  name: string;
  id: string;
  peerId: string;
  cursor: CursorPosition | null;
  user: { name: string };
}
export interface AbstractCard {
  title: string;
  icon: string;
  author: string;
  manager: string | null;
  trashed: boolean;
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Card = YoutubeCard | AvatarCard | QuillCard | ImageCard;

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

interface UpdatePeer {
  kind: "update_peer";
  peer: UserInfo;
}

interface RemovePeer {
  kind: "remove_peer";
  peerId: string;
}

interface SetCardLayering {
  kind: "set_card_layering";
  layering: string[];
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
  | RemovePeer
  | UpdatePeer
  | SetCardLayering;

export interface OverallState {
  cards: Card[];
  cardLayering: string[];
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
  dispatch?: React.Dispatch<action>;
  myStream: any;
  cardsY: any;
  cardLayeringY: any;
  myAvatarID?: string;
  awareness: awarenessProtocol.Awareness;
  peers: UserInfo[] = [];
  constructor() {
    this.ydoc = new Y.Doc();
    this.awareness = new awarenessProtocol.Awareness(this.ydoc);

    this.setupWatchers();
  }
  connect = async () => {
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
      awareness: this.awareness,
      peerOpts: { objectMode: false, streams: [] },
    } as any);
    this.provider?.key.then(() => {
      this.awareness.setLocalStateField("peerId", this.provider!.room!.peerId);
    });
    this.setupStream();
  };
  setupWatchers = () => {
    this.cardsY = this.ydoc.getMap("cards");
    this.cardLayeringY = this.ydoc.getArray("card-layering");
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
    this.cardLayeringY.observe((evt: any) => {
      if (this.dispatch) {
        this.dispatch({
          kind: "set_card_layering",
          layering: this.cardLayeringY.toArray(),
        });
      }
    });
    this.awareness.on("update", (changes: any, peer: any) => {
      const newStates = this.awareness.getStates();
      if (peer === "local") {
        return;
      }

      changes.added.forEach((id: number) => {
        const peerState = newStates.get(id) as UserInfo;
        this.dispatch!({ kind: "add_peer", peer: peerState });
      });
      changes.updated.forEach((id: number) => {
        const peerState = newStates.get(id) as UserInfo;
        if (peerState.cursor) {
          peerState.cursor = this.denormalize(peerState.cursor);
        }
        this.dispatch!({ kind: "update_peer", peer: peerState });
      });
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
  getMe = (): UserInfo => this.awareness.getLocalState() as UserInfo;
  addMyAvatar = async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const { peerId, id, name } = this.getMe();
    this.myStream = myStream;
    this.streamMap[peerId] = myStream;
    if (this.provider && this.provider.room) {
      this.provider.room.webrtcConns.forEach((conn: any) => {
        conn.peer.addStream(this.myStream);
        this.incrementTicker();
      });
    }
    const CardId = Math.random().toString();
    this.myAvatarID = id;
    // TODO: prevent from adding it twice
    this.addCard({
      kind: "avatar",
      title: name,
      icon: EyeIcon,
      x: 0,
      y: 0,
      id: CardId,
      w: 200,
      h: 200,
      author: id,
      manager: id,
      trashed: false,
    });
  };
  normalize = ({ x, y }: CursorPosition) => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    // return { x: (x * 1000) / width, y: (y * 1000) / height };
    return { x: (x * 1000) / width, y };
  };
  denormalize = ({ x, y }: CursorPosition) => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    // return { x: (x * width) / 1000, y: (y * height) / 1000 };
    return { x: (x * width) / 1000, y };
  };
  onDrag = (xDenorm: number, yDenorm: number, id: string) => {
    const oldCard = this.cardsY.get(id);
    const { x, y } = this.normalize({ x: xDenorm, y: yDenorm });
    this.updateCard({ ...oldCard, x, y });
  };
  setupCursorBroadcast = () => {
    document.addEventListener(
      "mousemove",
      debounce(
        (e: MouseEvent) => {
          const { x, y } = this.normalize({
            x: e.clientX,
            y: e.clientY,
          });
          this.awareness.setLocalStateField("cursor", { x, y });
        },
        10,
        { leading: true }
      )
    );
  };
  setupStream = async () => {
    try {
      this.provider!.on("peers", async (e: any) => {
        e.removed.forEach((peerId: string) => {
          console.log(peerId, "left");
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
            peer.on("connect", async () => {
              if (this.myStream) {
                peer.addStream(this.myStream);
                this.incrementTicker();
              }
            });
            peer.on("stream", async (stream: any) => {
              console.log("stream", stream);
              this.streamMap[peerId] = stream;
              this.incrementTicker();
            });
            peer.on("close", () => {
              const minKey = min(
                Array.from(this.awareness.getStates().keys())
              )!.toString();
              const peerLeftId = this.peers.find(
                (peer: any) => peer.peerId === peerId
              )!.id;
              this.cardsY.forEach((card: Card) => {
                if (peerLeftId === card.manager) {
                  this.updateCard({ ...card, manager: minKey });
                }
              });
              this.dispatch!({ kind: "remove_peer", peerId });
            });
          }
        });
      });
      this.setupCursorBroadcast();
    } catch (err) {
      console.log("error", err);
    }
  };
  defaultMe = (): OverallState => {
    return {
      cards: Array.from(this.cardsY.values()).filter(
        (card: any) => !card.trashed
      ) as Card[],
      cardLayering: [],
      myBackpack: [],
      ticker: 1,
      ready: false,
      peers: [],
    };
  };

  addCard = (card: Card) => {
    this.cardsY.set(card.id, card);
    this.cardLayeringY.push([card.id]);
  };
  updateCard = (card: Card) => {
    this.cardsY.set(card.id, card);
    const idx = this.cardLayeringY.toArray().indexOf(card.id);
    if (idx !== this.cardLayeringY.length - 1) {
      this.cardLayeringY.push([card.id]);
      this.cardLayeringY.delete(idx, 1);
    }
    if (
      card.author === this.getMe().id &&
      card.trashed &&
      card.kind === "avatar"
    ) {
      if (this.provider && this.provider.room) {
        // this.provider.room.webrtcConns.forEach((conn) => {
        //   conn.peer.removeStream(this.myStream);
        // });
      }
      this.myStream.getTracks().forEach((stream: any) => {
        stream.stop();
      });
    }
  };

  addFromBackpack = (card: Card) => {
    if (this.dispatch) {
      this.dispatch({ kind: "add_from_backpack", cardID: card.id });
      this.cardsY.set(card.id, card);
    }
  };
  setNameAndConnect = (name: string) => {
    this.awareness.setLocalState({
      name,
      cursor: null,
      id: this.ydoc.clientID.toString(),
      peerId: "",
      user: {
        name,
      },
    });
    this.dispatch!({ kind: "set_ready", myName: name });
    this.connect();
  };

  reducer = (state: OverallState, action: action): OverallState => {
    let newBackpack;
    let newState;
    let newPeers;
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
        if (state.myBackpack.some((card) => card.id === newCard.id)) {
          newBackpack = state.myBackpack.map((card) =>
            card.id === newCard.id ? newCard : card
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
          (card) => card.id !== action.cardID
        );
        saveBackpack(newBackpack);
        return { ...state, myBackpack: newBackpack };
      case "increment_ticker":
        return { ...state, ticker: state.ticker + 1 };
      case "set_ready":
        return { ...state, ready: true, peers: [...state.peers, this.getMe()] };
      case "add_peer":
        newPeers = [...state.peers, action.peer];
        this.peers = newPeers;
        return { ...state, peers: newPeers };
      case "remove_peer":
        newPeers = state.peers.filter((peer) => peer.peerId !== action.peerId);
        this.peers = newPeers;
        return {
          ...state,
          peers: newPeers,
        };
      case "update_peer":
        newPeers = state.peers.map((peer) =>
          peer.id === action.peer.id ? action.peer : peer
        );
        this.peers = newPeers;
        return {
          ...state,
          peers: newPeers,
        };
      case "set_card_layering":
        return { ...state, cardLayering: action.layering };
    }
  };
}

export default DataManager;
