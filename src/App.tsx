import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import ReactPlayer from "react-player";
import "@reach/dialog/styles.css";
import SpellPicker from "./SpellPicker";

export interface AbstractCard {
  layout: GridLayout.Layout;
  title: string;
  icon: string;
}

export interface YoutubeCard extends AbstractCard {
  kind: "youtube";
  uri: string;
}

export interface AvatarCard extends AbstractCard {
  kind: "avatar";
}

export type Card = YoutubeCard | AvatarCard;

const AvatarCardComponent: React.FC<{ card: AvatarCard }> = ({ card }) => {
  const videoElement = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoElement) {
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      let video = videoElement.current;
      if (!video) {
        return;
      }
      video.srcObject = stream;
      video.play();
    });
  }, [videoElement]);
  return (
    <video ref={videoElement} style={{ width: "100%", objectFit: "contain" }} />
  );
};

const YoutubeCardComponent: React.FC<{
  card: YoutubeCard;
  updateData(card: YoutubeCard): void;
}> = ({ card, updateData }) => {
  const onReady = useCallback(
    (player: ReactPlayer) => {
      const activePlayer = player.getInternalPlayer() as any;
      const video_data = activePlayer.getVideoData();
      const title = video_data.title;
      updateData({ ...card, title });
    },
    [card]
  );
  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <ReactPlayer
        url={card.uri}
        width={"100%"}
        height={"100%"}
        style={{ position: "absolute", top: 0, left: 0 }}
        onReady={onReady}
      />
    </div>
  );
};

interface AddCard {
  kind: "add_card";
  card: Card;
}

interface UpdateCard {
  kind: "update_card";
  card: Card;
}

interface BatchUpdateLayouts {
  kind: "batch_update_layouts";
  layouts: Layout[];
}

export type action = AddCard | UpdateCard | BatchUpdateLayouts;

const reducer = (state: Card[], action: action): Card[] => {
  const newCards = [...state];
  switch (action.kind) {
    case "add_card":
      return [...state, action.card];
    case "update_card":
      const idx = newCards.findIndex(
        (crd) => crd.layout.i === action.card.layout.i
      );
      newCards[idx] = action.card;
      return newCards;
    case "batch_update_layouts":
      return state.map((card) => ({
        ...card,
        layout:
          action.layouts.find(({ i }) => i === card.layout.i) || card.layout,
      }));
  }
};

function App() {
  // https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm
  const [cards, dispatch] = useReducer(reducer, [
    {
      kind: "avatar",
      title: "me",
      icon: "camera",
      layout: {
        i: "1",
        x: 0,
        y: 0,
        w: 2,
        h: 1,
      },
    },
  ]);
  const [showSpellPicker, setShowSpellPicker] = useState(false);
  const onLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      dispatch({ kind: "batch_update_layouts", layouts: newLayout });
    },
    [cards]
  );
  // TODO: spaces/backpack

  const updateCard = useCallback(
    (card: Card) => {
      dispatch({ kind: "update_card", card });
    },
    [cards]
  );
  return (
    <div className="App">
      <header
        style={{
          backgroundColor: "#C39B77",
          color: "#3A1915",
          height: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 0px 0px 5px",
          borderBottom: "1px solid black",
          fontFamily: `"Alagard", serif`,
        }}
      >
        <nav>
          <button onClick={() => setShowSpellPicker(true)}>spells</button>
        </nav>
        <nav>DungeonCard</nav>
      </header>
      <SpellPicker
        show={showSpellPicker}
        onClose={() => setShowSpellPicker(false)}
        dispatch={dispatch}
      />
      <GridLayout
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={300}
        width={window.innerWidth}
        autoSize={true}
        compactType={null}
        // isBounded={true}
        isResizable={true}
        resizeHandles={["se"]}
      >
        {cards.map((card: Card, key: number) => (
          <div
            key={card.layout.i}
            data-grid={card.layout}
            style={{
              backgroundColor: "sandybrown",
              padding: "10px",
              display: "flex",
              flexFlow: "column",
            }}
          >
            <div
              style={{
                flex: "0 1 auto",
                fontFamily: `"Alagard"`,
                fontSize: "18px",
              }}
            >
              <img src={card.icon} height={12} /> {card.title}
            </div>
            <div style={{ overflow: "hidden" }}>
              {card.kind === "avatar" ? (
                <AvatarCardComponent card={card} />
              ) : (
                <YoutubeCardComponent card={card} updateData={updateCard} />
              )}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

export default App;
