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
import Logo from "./assets/logo.png";
import Greeter from "./assets/greeter.gif";
import Board from "./assets/board.png";
import GrabbyCursor from "./assets/grabby_cursor.png";
import DataManager, { action, Card } from "./DataManager";
import QuillCardComponent from "./cards/QuillCardComponent";
import Draggable from "react-draggable";
import CardPicker from "./CardPicker";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import styled from "styled-components";
import ImageCardComponent from "./cards/ImageCardComponent";
import FrameBorder from "./assets/border.png";
import TextInputForm from "./TextInputForm";
import { BORDER_PRIMARY_COLOR, BORDER_SECONDARY_COLOR } from "./colors";
import ChatCardComponent from "./cards/ChatCardComponent";
import CrumpleSfx1 from "./assets/crumple-1.mp3";
import useSound from "use-sound";

export type dispatcher = React.Dispatch<action>;

export const dataManager = new DataManager();

export const CardSwitcher = (
  card: Card,
  ticker: number,
  dispatch: React.Dispatch<action>
): JSX.Element => {
  switch (card.kind) {
    case "avatar":
      return <AvatarCardComponent card={card} ticker={ticker} />;
    case "youtube":
      return <YoutubeCardComponent card={card} dispatch={dispatch} />;
    case "quill":
      return <QuillCardComponent card={card} />;
    case "image":
      return <ImageCardComponent card={card} />;
    case "chat":
      return <ChatCardComponent card={card} />;
  }
};

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

  const [playCrumple] = useSound(CrumpleSfx1);

  const { cards, ticker, cardLayering } = state;
  const [showBackpack, setShowBackpack] = useState(false);

  useEffect(() => {
    dataManager.setDispatch(dispatch);
  }, [dispatch]);
  const onSubmitName = useCallback((name: string) => {
    dataManager.setNameAndConnect(name);
  }, []);
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
  const remove = useCallback(
    (card: Card) => {
      const confirmed = window.confirm(
        `are you sure you want to delete "${card.title}"?`
      );
      if (confirmed) {
        dataManager.updateCard({ ...card, trashed: true });
        playCrumple();
      }
    },
    [playCrumple]
  );
  const addToBackpack = useCallback(
    (card: Card) => {
      dispatch({ kind: "add_to_backpack", card });
      playCrumple();
    },
    [playCrumple, dispatch]
  );
  if (!state.ready) {
    return (
      <div
        className="App"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "Alagard",
        }}
      >
        <div
          style={{
            width: "100%",
            flexShrink: 1,
            flexGrow: 1,
            position: "relative",
            backgroundImage: `url(${Greeter})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={Logo}
            style={{
              width: "50%",
              position: "absolute",
              bottom: -100,
              left: 0,
              right: 0,
              marginLeft: "auto",
              marginRight: "auto",
              zIndex: 100000,
            }}
          />
        </div>
        <div
          style={{
            flexGrow: 1,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#292019",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <h1 style={{ color: BORDER_PRIMARY_COLOR }}>
                What is your name, traveller?
              </h1>
            </div>
            <div>
              <TextInputForm
                onSubmit={onSubmitName}
                maxLength={50}
                placeholder={"name"}
                regex={null}
              />
            </div>
          </div>
        </div>
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
          <div style={{ display: "inline", overflow: "hidden" }}>
            {state.peers
              .filter(
                (peer) => peer.currentTab === dataManager.getMe().currentTab
              )
              .map((peer) => (
                <div
                  style={{
                    color: "#FFFFFF",
                    margin: "0 5px 0 5px",
                    display: "inline-block",
                    backgroundColor: BORDER_SECONDARY_COLOR,
                  }}
                  key={peer.id}
                >
                  {truncate(peer.name, { length: 15 })}
                </div>
              ))}
          </div>
          <span>Tavern Card</span>
        </nav>
      </header>
      <div style={{ position: "absolute" }}>
        {state.peers
          .filter((peer) => peer.currentTab === dataManager.getMe().currentTab)
          .map((peer) =>
            peer.mouse && peer.id !== dataManager.getMe().id ? (
              <div
                style={{
                  position: "absolute",
                  transform: `translate(${peer.mouse.x}px, ${peer.mouse.y}px)`,
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
                  {truncate(peer.name, { length: 15 })}
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
        style={{
          position: "relative",
          width: "100vw",
          flexGrow: 1,
          zIndex: 0,
          boxShadow: "inset 0 0 100px black",
          backgroundColor: "radial-gradient(#cc975c, #8f4b33)",
          backgroundImage: `url(${Board})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
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
                maxConstraints={[1000, 1000]}
                onResize={(e, data) => onResize(e, data, card)}
                lockAspectRatio={card.kind !== "quill" && card.kind !== "chat"}
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
                      backgroundImage: `url(${FrameBorder})`,
                      backgroundRepeat: "repeat",
                      userSelect: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: `url(${GrabbyCursor}), auto`,
                      color: BORDER_PRIMARY_COLOR,
                    }}
                    className="handle"
                  >
                    <div>
                      <img
                        src={card.icon}
                        width={20}
                        style={{
                          verticalAlign: "middle",
                          marginLeft: "10px",
                        }}
                        draggable="false"
                      />{" "}
                      <span>{truncate(card.title, { length: 24 })}</span>
                    </div>
                    <div>
                      {!(card.kind === "avatar") && (
                        <button
                          onClick={() => addToBackpack(card)}
                          style={{
                            border: "none",
                            background: "none",
                            padding: 0,
                            // backgroundColor: BORDER_PRIMARY_COLOR,
                          }}
                        >
                          <img
                            width={20}
                            src={BackpackIcon}
                            style={{
                              verticalAlign: "middle",
                              filter: `drop-shadow(1px 1px 0 ${BORDER_PRIMARY_COLOR}) drop-shadow(-1px -1px 0 ${BORDER_PRIMARY_COLOR})`,
                            }}
                          />
                        </button>
                      )}
                      <button
                        onClick={() => remove(card)}
                        style={{
                          fontFamily: "Alagard",
                          color: "#FFFFFF",
                          backgroundColor: BORDER_SECONDARY_COLOR,
                          border: `0.8px solid ${BORDER_PRIMARY_COLOR}`,
                          borderRadius: "5px",
                          marginLeft: "5px",
                        }}
                      >
                        x
                      </button>
                    </div>
                  </div>
                  <div style={{ flexGrow: 1, overflow: "hidden" }}>
                    {CardSwitcher(card, ticker, dispatch)}
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
