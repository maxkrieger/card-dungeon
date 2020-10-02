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
import YoutubeCardComponent from "./YoutubeCardComponent";
import AvatarCardComponent from "./AvatarCardComponent";
import BackpackComponent from "./BackpackComponent";
import { truncate } from "lodash";
import BackpackIcon from "./assets/backpack.png";
import OrbIcon from "./assets/orb.png";
import DataManager, { Card } from "./DataManager";
// import FrameBorder from "./assets/frame-border.png";

const NUM_COLS = 12;

export const BORDER_SECONDARY_COLOR = "#3A1915";
export const BORDER_PRIMARY_COLOR = "#C39B77";

export const dataManager = new DataManager();

function App() {
  const [state, dispatch] = useReducer(
    dataManager.reducer,
    dataManager.defaultMe()
  );
  dataManager.setDispatch(dispatch);
  useEffect(() => {
    const backpackLoaded = localStorage.getItem("myBackpack");
    if (backpackLoaded) {
      dispatch({ kind: "set_backpack", backpack: JSON.parse(backpackLoaded) });
    }
  }, [dispatch]);

  const { cards } = state;
  const [showSpellPicker, setShowSpellPicker] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    dataManager.updateLayouts(newLayout);
  }, []);
  useEffect(() => {
    dataManager.setDispatch(dispatch);
  }, [dispatch]);

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
            <img
              src={OrbIcon}
              width={20}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
            <span>spells</span>
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
            <img
              src={BackpackIcon}
              width={20}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
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
        cols={NUM_COLS}
        rowHeight={window.innerWidth / NUM_COLS}
        width={window.innerWidth}
        autoSize={true}
        compactType={null}
        // isBounded={true}
        layout={cards.map(({ layout }) => layout)}
        margin={[30, 30]}
        isResizable={true}
        resizeHandles={["se"]}
        draggableHandle=".bar"
      >
        {cards.map((card: Card, key: number) => {
          return (
            <div
              key={card.layout.i}
              // this is naughty
              // data-grid={JSON.parse(
              //   JSON.stringify({ ...card.layout, minW: 2, minH: 1 })
              // )}
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
                  flexShrink: 0,
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
                      onClick={() =>
                        dispatch({ kind: "add_to_backpack", card })
                      }
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
              <div style={{ overflow: "hidden", flexGrow: 1 }}>
                {card.kind === "avatar" ? (
                  <AvatarCardComponent card={card} />
                ) : (
                  <YoutubeCardComponent card={card} dispatch={dispatch} />
                )}
              </div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}

export default App;
