import React, { useCallback } from "react";
import ReactPlayer from "react-player";
import { AbstractCard, action } from "./App";

export interface YoutubeCard extends AbstractCard {
  kind: "youtube";
  uri: string;
}

const YoutubeCardComponent: React.FC<{
  card: YoutubeCard;
  dispatch: React.Dispatch<action>;
}> = ({ card, dispatch }) => {
  const onReady = useCallback(
    (player: ReactPlayer) => {
      const activePlayer = player.getInternalPlayer() as any;
      const video_data = activePlayer.getVideoData();
      const title = video_data.title;
      dispatch({ kind: "update_card", card: { ...card, title } });
    },
    [card, dispatch]
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

export default YoutubeCardComponent;
