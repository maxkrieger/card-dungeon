import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { AvatarCard } from "./cards/AvatarCardComponent";
import { YoutubeCard } from "./cards/YoutubeCardComponent";
import EyeIcon from "./assets/eye.png";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { QuillCard } from "./cards/QuillCardComponent";
import { debounce, min, random } from "lodash";
import { ImageCard } from "./cards/ImageCardComponent";
import { ChatCard } from "./cards/ChatCardComponent";
import GlassFx1 from "./assets/glass-1.mp3";
import GlassFx2 from "./assets/glass-2.mp3";
import GlassFx3 from "./assets/glass-3.mp3";
import { Howl } from "howler";

interface CursorPosition {
  x: number;
  y: number;
}

interface UserInfo {
  name: string;
  id: string;
  peerId: string;
  mouse: CursorPosition | null;
  currentTab: number;
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

export type Card = YoutubeCard | AvatarCard | QuillCard | ImageCard | ChatCard;

interface IncrementTicker {
  kind: "increment_ticker";
}

interface AddToBackpack {
  kind: "add_to_backpack";
  card: Card;
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

interface RemoveFromBackpack {
  kind: "remove_from_backpack";
  card: Card;
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
  | IncrementTicker
  | SetReady
  | AddPeer
  | RemovePeer
  | UpdatePeer
  | SetCardLayering
  | RemoveFromBackpack;

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
  knocks: any[];
  constructor() {
    this.ydoc = new Y.Doc();
    this.awareness = new awarenessProtocol.Awareness(this.ydoc);

    this.setupWatchers();
    this.knocks = [
      new Howl({ src: [GlassFx1] }),
      new Howl({ src: [GlassFx2] }),
      new Howl({ src: [GlassFx3] }),
    ];
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
    const knock = this.ydoc.getArray("knock");
    knock.observe((e, arr) => {
      if (knock.length > 0) {
        const last = knock.get(knock.length - 1) as number;
        this.knocks[last].play();
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
        if (peerState.mouse) {
          peerState.mouse = this.denormalize(peerState.mouse);
        }
        this.dispatch!({ kind: "update_peer", peer: peerState });
      });
    });
    setTimeout(() => {
      if (this.dispatch) {
        this.dispatch({
          kind: "set_card_layering",
          layering: this.cardLayeringY.toArray(),
        });
        this.dispatch({
          kind: "set_cards",
          cards: (Array.from(this.cardsY.values()) as Card[]).filter(
            (card) => !card.trashed
          ),
        });
      } else {
        console.log("dispatch unavailable");
      }
    }, 100);
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
  knockTable = () => {
    if (this.ydoc.getArray("knock").length > 0) {
      this.ydoc.getArray("knock").delete(0, 1);
    }
    this.ydoc.getArray("knock").push([random(0, 2)]);
  };
  addMyAvatar = async () => {
    const { peerId, id, name } = this.getMe();
    const myExistingAvatars = Array.from(this.cardsY.values()).filter(
      (card: any) =>
        card.kind === "avatar" && card.author === id && !card.trashed
    );
    if (myExistingAvatars.length === 0) {
      let myStream;
      try {
        myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (err) {
        alert("could not get your camera feed");
        return;
      }
      const { width, height } = myStream.getVideoTracks()[0].getSettings() as {
        width: number;
        height: number;
      };
      this.myStream = myStream;
      this.streamMap[peerId] = myStream;
      if (this.provider && this.provider.room) {
        this.provider.room.webrtcConns.forEach((conn: any) => {
          conn.peer.addStream(this.myStream);
          this.incrementTicker();
        });
      }
      const CardId = gordonId();
      this.myAvatarID = id;
      // https://stackoverflow.com/a/14731922
      const ratio = Math.min(300 / width, 200 / height);
      this.addCard({
        kind: "avatar",
        title: name,
        icon: EyeIcon,
        x: 0,
        y: 0,
        id: CardId,
        w: width * ratio,
        h: height * ratio + 20,
        author: id,
        manager: id,
        trashed: false,
      });
    }
  };
  normalize = ({ x, y }: CursorPosition) => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    return { x: (x * 1000) / width, y: (y * 1000) / height };
  };
  denormalize = ({ x, y }: CursorPosition) => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    return { x: (x * width) / 1000, y: (y * height) / 1000 };
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
          this.awareness.setLocalStateField("mouse", { x, y });
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
    if (card.trashed && idx > -1) {
      this.cardLayeringY.delete(idx, 1);
    } else if (idx !== this.cardLayeringY.length - 1) {
      this.cardLayeringY.push([card.id]);
      this.cardLayeringY.delete(idx, 1);
    }
    if (
      card.author === this.getMe().id &&
      card.trashed &&
      card.kind === "avatar"
    ) {
      if (this.provider && this.provider.room) {
        console.log("removing stream");
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
      // this.dispatch({ kind: "add_from_backpack", cardID: card.id });
      this.addCard(card);
      if (card.kind === "quill") {
        this.ydoc.getText(card.textID).insert(0, card.initialText, {});
      }
    }
  };
  addAllOnScreenToBackpack = () => {
    this.cardsY.forEach((card: Card) => {
      if (
        !card.trashed &&
        this.dispatch !== undefined &&
        card.kind !== "avatar"
      ) {
        this.dispatch({ kind: "add_to_backpack", card });
      }
    });
  };
  setNameAndConnect = (name: string) => {
    const initialState: UserInfo = {
      name,
      mouse: null,
      id: this.ydoc.clientID.toString(),
      currentTab: 0,
      peerId: "",
      user: {
        name,
      },
    };
    this.awareness.setLocalState(initialState);
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
        } else if (newCard.kind === "quill") {
          newCard.initialText = this.ydoc.getText(newCard.textID).toString();
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
      case "remove_from_backpack":
        newBackpack = state.myBackpack.filter(
          (card) => card.id !== action.card.id
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
