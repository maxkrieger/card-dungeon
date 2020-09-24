import React, { useCallback, useEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import ReactPlayer from "react-player";

export interface AbstractCard {
  layout: GridLayout.Layout;
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
  return <video ref={videoElement} style={{ width: "100%", height: "100%" }} />;
};

const YoutubeCardComponent: React.FC<{ card: YoutubeCard }> = ({ card }) => {
  return <ReactPlayer url={card.uri} />;
};

function App() {
  // https://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm
  const [cards, setCards] = useState<Card[]>([
    {
      kind: "avatar",
      layout: {
        i: "1",
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        isBounded: true,
        isResizable: true,
      },
    },
  ]);
  const onLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const newCards = cards.map((card) => ({
        ...card,
        layout: newLayout.find(({ i }) => i === card.layout.i) || card.layout,
      }));
      setCards(newCards);
    },
    [cards]
  );
  const addYoutube = useCallback(() => {
    const vid = window.prompt("url?");
  }, [cards]);
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
          <button onClick={addYoutube}>spells</button>
        </nav>
        <nav>DungeonCard</nav>
      </header>
      <GridLayout
        onLayoutChange={onLayoutChange}
        cols={12}
        width={window.innerWidth}
        compactType={null}
      >
        {cards.map((card: Card, key: number) => (
          <div
            key={card.layout.i}
            data-grid={card.layout}
            style={{ backgroundColor: "sandybrown" }}
          >
            {card.kind === "avatar" ? (
              <AvatarCardComponent card={card} />
            ) : (
              <YoutubeCardComponent card={card} />
            )}
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

export default App;
