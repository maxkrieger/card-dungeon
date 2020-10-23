import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import "@reach/dialog/styles.css";
import YoutubeCardComponent from "./cards/YoutubeCardComponent";
import AvatarCardComponent from "./cards/AvatarCardComponent";
import BackpackComponent from "./BackpackComponent";
import { truncate } from "lodash";
import BackpackIcon from "./assets/backpack.png";
import OrbIcon from "./assets/orb.png";
import GrabbyCursor from "./assets/grabby_cursor.png";
import DataManager, { action, Card } from "./DataManager";
import QuillCardComponent from "./cards/QuillCardComponent";
import QuillCursors from "quill-cursors";
import { Quill } from "react-quill";
import Draggable from "react-draggable";
import CardPicker from "./CardPicker";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
// import FrameBorder from "./assets/frame-border.png";

Quill.register("modules/cursors", QuillCursors);

export type dispatcher = React.Dispatch<action>;

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

  const { cards, ticker, cardLayering } = state;
  const [showBackpack, setShowBackpack] = useState(false);

  useEffect(() => {
    dataManager.setDispatch(dispatch);
  }, [dispatch]);
  const [myName, setMyName] = useState("");
  const onSubmitName = useCallback(
    (e: any) => {
      e.preventDefault();
      dataManager.setNameAndConnect(myName);
    },
    [myName]
  );
  const onResize = useCallback(
    (e: SyntheticEvent, data: ResizeCallbackData, card: Card) => {
      dataManager.updateCard({
        ...card,
        w: data.size.width,
        h: data.size.height,
      });
    },
    []
  );
  const remove = useCallback((card: Card) => {
    dataManager.updateCard({ ...card, trashed: true });
  }, []);
  if (!state.ready) {
    return (
      <div className="App" style={{ padding: "1em", fontFamily: `"Alagard"` }}>
        <h1>What is your name, traveller?</h1>
        <form onSubmit={onSubmitName}>
          <input
            type="text"
            value={myName}
            onChange={(e: any) => setMyName(e.target.value)}
            autoFocus={true}
          />
          <input
            type="submit"
            value={`It is me${myName ? ", " + myName : ""}!`}
          />
        </form>
      </div>
    );
  }
  return (
    <div
      className="App"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
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
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        <nav>
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
        <nav>
          <div style={{ display: "inline" }}>
            {state.peers.map((peer) => (
              <div
                style={{
                  color: "#FFFFFF",
                  margin: "0 5px 0 5px",
                  display: "inline-block",
                  backgroundColor: BORDER_SECONDARY_COLOR,
                }}
                key={peer.id}
              >
                {peer.name}
              </div>
            ))}
          </div>
          <span>Tavern Cards</span>
        </nav>
      </header>
      <div style={{ position: "absolute" }}>
        {state.peers.map((peer) =>
          peer.cursor && peer.id !== dataManager.getMe().id ? (
            <div
              style={{
                position: "absolute",
                transform: `translate(${peer.cursor.x}px, ${peer.cursor.y}px)`,
                zIndex: 1000,
                pointerEvents: "none",
                display: "flex",
                flexFlow: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={"cursor" + peer.id}
            >
              <img src={GrabbyCursor} />
              <div
                style={{
                  fontFamily: `"Alagard"`,
                  color: "#FFFFFF",
                  marginTop: "5px",
                  backgroundColor: BORDER_SECONDARY_COLOR,
                }}
              >
                {peer.name}
              </div>
            </div>
          ) : null
        )}
      </div>

      <BackpackComponent
        show={showBackpack}
        onClose={() => setShowBackpack(false)}
        dispatch={dispatch}
        backpack={state.myBackpack}
      />
      <CardPicker dispatch={dispatch} />
      <div
        style={{ position: "relative", width: "100vw", flexGrow: 1, zIndex: 0 }}
        className="cardBody"
      >
        {cards.map((card: Card, key: number) => {
          const denorm = dataManager.denormalize({ x: card.x, y: card.y });
          return (
            <Draggable
              handle=".handle"
              position={{ x: denorm.x, y: denorm.y }}
              defaultPosition={{ x: 0, y: 0 }}
              key={card.id}
              bounds=".cardBody"
              onDrag={(e, data) => dataManager.onDrag(data.x, data.y, card.id)}
            >
              <ResizableBox
                width={card.w}
                height={card.h}
                minConstraints={[50, 50]}
                onResize={(e, data) => onResize(e, data, card)}
                lockAspectRatio={true}
                // @ts-ignore
                style={{
                  zIndex: (cardLayering.indexOf(card.id) + 1) * 10,
                  position: "absolute",
                }}
                // handle={<div style={{ width: "10px", height: "10px" }} />}
                resizeHandles={["se"]}
              >
                <div
                  style={{
                    width: card.w,
                    height: card.h,
                    backgroundColor: "#292019",
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
                      cursor: `url(${GrabbyCursor}), auto`,
                    }}
                    className="handle"
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
                          style={{
                            border: "none",
                            background: "none",
                            padding: 0,
                          }}
                        >
                          <img
                            width={20}
                            src={BackpackIcon}
                            style={{ verticalAlign: "middle" }}
                          />
                        </button>
                      )}
                      <button onClick={() => remove(card)}>x</button>
                    </div>
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    {card.kind === "avatar" ? (
                      <AvatarCardComponent card={card} ticker={ticker} />
                    ) : card.kind === "youtube" ? (
                      <YoutubeCardComponent card={card} dispatch={dispatch} />
                    ) : (
                      <QuillCardComponent card={card} />
                    )}
                  </div>
                </div>
              </ResizableBox>
            </Draggable>
          );
        })}
      </div>
    </div>
  );
}

export default App;
