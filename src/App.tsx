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
import BackpackIcon from "./assets/backpack.png";
import EyeIcon from "./assets/eye.png";
// import FrameBorder from "./assets/frame-border.png";
interface UserInfo {
  name: string;
  id: string;
}
export interface AbstractCard {
  layout: GridLayout.Layout;
  title: string;
  icon: string;
  author: UserInfo;
  manager: UserInfo | null;
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

interface VideoAction {
  kind: "video_action";
  card: YoutubeCard;
}

export type action =
  | AddCard
  | UpdateCard
  | BatchUpdateLayouts
  | LoadBackpack
  | AddToBackpack
  | AddFromBackpack
  | ClearBackpack
  | VideoAction;

export interface OverallState {
  cards: Card[];
  myBackpack: Card[];
  me: UserInfo;
}

const saveBackpack = (backpack: Card[]) => {
  localStorage.setItem("myBackpack", JSON.stringify(backpack));
};

const reducer = (state: OverallState, action: action): OverallState => {
  let newCards = [...state.cards];
  let newBackpack;
  let newState;
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
      let newLayouts = state.cards
        .map((card) => ({
          ...card,
          layout:
            action.layouts.find(({ i }) => i === card.layout.i) || card.layout,
        }))
        .map((card) => {
          const { layout } = card;
          const { w, h } = layout;
          if (h > w) {
            // for some reason doesnt work immutably
            card.layout.h = w;
            return card;
          }
          return card;
        });
      return {
        ...state,
        cards: newLayouts,
      };
    case "load_backpack":
      return { ...state, myBackpack: action.backpack };
    case "add_to_backpack":
      let newCard = { ...action.card };
      if (newCard.kind === "youtube") {
        newCard.state = { ...newCard.state, playing: false };
      }
      if (state.myBackpack.some((card) => card.layout.i === newCard.layout.i)) {
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
      let addedCard = state.myBackpack.find(
        (card) => card.layout.i === action.cardID
      );
      if (!addedCard) {
        return state;
      }
      if (state.cards.some((crd) => crd.layout.i === action.cardID)) {
        return state;
      }
      newCards = [...state.cards, addedCard];
      newBackpack = state.myBackpack.filter(
        (card) => card.layout.i !== action.cardID
      );
      saveBackpack(newBackpack);
      return { ...state, cards: newCards, myBackpack: newBackpack };
    case "video_action":
      newCards = state.cards.map((card) =>
        card.layout.i === action.card.layout.i ? action.card : card
      );
      return { ...state, cards: newCards };
  }
};

export const BORDER_SECONDARY_COLOR = "#3A1915";
export const BORDER_PRIMARY_COLOR = "#C39B77";

const MECONST = {
  id: "meme",
  name: "me",
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    me: MECONST,
    cards: [
      {
        kind: "avatar",
        title: "me",
        icon: EyeIcon,
        layout: {
          i: "1",
          x: 0,
          y: 0,
          w: 2,
          h: 2,
        },
        author: {
          name: "",
          id: "",
        },
        manager: {
          name: "",
          id: "",
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
    [dispatch]
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
          userSelect: "none",
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
            <img src={BackpackIcon} width={20} />
            <span>
              backpack{" "}
              {state.myBackpack.length > 0 && `(${state.myBackpack.length})`}
            </span>
          </div>
        </nav>
        <nav>Tavern Cards</nav>
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
        rowHeight={window.innerWidth / 12}
        width={window.innerWidth}
        autoSize={true}
        compactType={null}
        // isBounded={true}
        margin={[30, 30]}
        isResizable={true}
        resizeHandles={["se"]}
        draggableHandle=".bar"
      >
        {cards.map((card: Card, key: number) => (
          <div
            key={card.layout.i}
            // this is naughty
            data-grid={{ ...card.layout, minW: 2, minH: 1 }}
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
              className="bar"
            >
              <div>
                <img
                  src={card.icon}
                  width={20}
                  style={{ verticalAlign: "middle", marginLeft: "10px" }}
                />{" "}
                <span>{truncate(card.title, { length: 24 })}</span>
              </div>
              <div>
                {!(card.kind === "avatar") && (
                  <button
                    onClick={() => dispatch({ kind: "add_to_backpack", card })}
                    style={{ border: "none", background: "none", padding: 0 }}
                  >
                    <img
                      width={20}
                      src={BackpackIcon}
                      style={{ verticalAlign: "middle" }}
                    />
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
