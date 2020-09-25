import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "@reach/dialog/styles.css";
import SpellPicker from "./SpellPicker";
import YoutubeCardComponent, { YoutubeCard } from "./YoutubeCardComponent";
import AvatarCardComponent, { AvatarCard } from "./AvatarCardComponent";
import BackpackComponent from "./BackpackComponent";
import { truncate } from "lodash";
// import FrameBorder from "./assets/frame-border.png";

export interface AbstractCard {
  layout: GridLayout.Layout;
  title: string;
  icon: string;
}

export type Card = YoutubeCard | AvatarCard;

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

interface LoadBackpack {
  kind: "load_backpack";
  backpack: Card[];
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

export type action =
  | AddCard
  | UpdateCard
  | BatchUpdateLayouts
  | LoadBackpack
  | AddToBackpack
  | AddFromBackpack
  | ClearBackpack;

export interface OverallState {
  cards: Card[];
  myBackpack: Card[];
}

const saveBackpack = (backpack: Card[]) => {
  localStorage.setItem("myBackpack", JSON.stringify(backpack));
};

const reducer = (state: OverallState, action: action): OverallState => {
  const newCards = [...state.cards];
  switch (action.kind) {
    case "add_card":
      return { ...state, cards: [...state.cards, action.card] };
    case "update_card":
      let idx = newCards.findIndex(
        (crd) => crd.layout.i === action.card.layout.i
      );
      newCards[idx] = action.card;
      return { ...state, cards: newCards };
    case "batch_update_layouts":
      return {
        ...state,
        cards: state.cards.map((card) => ({
          ...card,
          layout:
            action.layouts.find(({ i }) => i === card.layout.i) || card.layout,
        })),
      };
    case "load_backpack":
      return { ...state, myBackpack: action.backpack };
    case "add_to_backpack":
      let newBackpack = [...state.myBackpack, action.card];
      saveBackpack(newBackpack);
      // remove card from env
      const filteredCards = state.cards.filter(
        (card) => action.card.layout.i !== card.layout.i
      );
      return { ...state, cards: filteredCards, myBackpack: newBackpack };
    case "clear_backpack":
      let newState = { ...state, myBackpack: [] };
      saveBackpack([]);
      return newState;
    case "add_from_backpack":
      // UNIMPL
      return { ...state };
  }
};

export const BORDER_SECONDARY_COLOR = "#3A1915";
export const BORDER_PRIMARY_COLOR = "#C39B77";

function App() {
  const [state, dispatch] = useReducer(reducer, {
    cards: [
      {
        kind: "avatar",
        title: "me",
        icon: "camera",
        layout: {
          i: "1",
          x: 0,
          y: 0,
          w: 2,
          h: 2,
        },
      },
    ],
    myBackpack: [],
  });
  useEffect(() => {
    const backpackLoaded = localStorage.getItem("myBackpack");
    if (backpackLoaded) {
      dispatch({ kind: "load_backpack", backpack: JSON.parse(backpackLoaded) });
    }
  }, [dispatch]);

  const { cards } = state;
  const [showSpellPicker, setShowSpellPicker] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const onLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      dispatch({ kind: "batch_update_layouts", layouts: newLayout });
    },
    [cards]
  );

  return (
    <div className="App">
      <header
        style={{
          backgroundColor: BORDER_PRIMARY_COLOR,
          color: BORDER_SECONDARY_COLOR,
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
          <div
            onClick={() => setShowSpellPicker(true)}
            style={{
              cursor: "pointer",
              color: showSpellPicker
                ? BORDER_PRIMARY_COLOR
                : BORDER_SECONDARY_COLOR,
              background: showSpellPicker
                ? BORDER_SECONDARY_COLOR
                : BORDER_PRIMARY_COLOR,
              display: "inline-block",
              marginLeft: "10px",
            }}
          >
            spells
          </div>
          <div
            onClick={() => setShowBackpack(true)}
            style={{
              cursor: "pointer",
              color: showBackpack
                ? BORDER_PRIMARY_COLOR
                : BORDER_SECONDARY_COLOR,
              background: showBackpack
                ? BORDER_SECONDARY_COLOR
                : BORDER_PRIMARY_COLOR,
              display: "inline-block",
              marginLeft: "10px",
            }}
          >
            backpack{" "}
            {state.myBackpack.length > 0 && `(${state.myBackpack.length})`}
          </div>
        </nav>
        <nav>DungeonCard</nav>
      </header>
      <SpellPicker
        show={showSpellPicker}
        onClose={() => setShowSpellPicker(false)}
        dispatch={dispatch}
      />
      <BackpackComponent
        show={showBackpack}
        onClose={() => setShowBackpack(false)}
        dispatch={dispatch}
        backpack={state.myBackpack}
      />
      <GridLayout
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={100}
        width={window.innerWidth}
        autoSize={true}
        compactType={null}
        // isBounded={true}
        margin={[30, 30]}
        isResizable={true}
        resizeHandles={["se"]}
      >
        {cards.map((card: Card, key: number) => (
          <div
            key={card.layout.i}
            data-grid={card.layout}
            style={{
              backgroundColor: "sandybrown",
              display: "flex",
              flexFlow: "column",
              boxShadow: "5px 5px hsla(0, 0%, 0%, 0.5)",
              // border: "10px solid transparent",
              // borderImageSource: `url(${FrameBorder})`,
              // borderImageRepeat: "stretch",
              // borderImageSlice: "34 13 34 13",
            }}
          >
            <div
              style={{
                flex: "0 1 auto",
                fontFamily: `"Alagard"`,
                fontSize: "18px",
                backgroundColor: "#C39B77",
                userSelect: "none",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <img src={card.icon} height={12} />{" "}
                {truncate(card.title, { length: 24 })}
              </div>
              <div>
                {!(card.kind === "avatar") && (
                  <button
                    onClick={() => dispatch({ kind: "add_to_backpack", card })}
                  >
                    b
                  </button>
                )}
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              {card.kind === "avatar" ? (
                <AvatarCardComponent card={card} />
              ) : (
                <YoutubeCardComponent card={card} dispatch={dispatch} />
              )}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

export default App;
