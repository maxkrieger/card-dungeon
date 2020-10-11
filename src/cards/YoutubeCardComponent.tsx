import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { AbstractCard, action, gordonId } from "../DataManager";
import { PickerProps } from "../SpellPicker";
import YoutubeIcon from "../assets/youtube.png";
import { dataManager } from "../App";

export interface PlayerState {
  playing: boolean;
  playedProgress: number;
  playedSeconds: number;
  volume: number;
  muted: boolean;
}
export interface YoutubeCard extends AbstractCard {
  kind: "youtube";
  uri: string;
  state: PlayerState;
}

const regex = `https?:\\/\\/(www\\.)?youtube.com\\/watch\\?v=.+`;

const api_key = process.env.REACT_APP_YOUTUBE_API_KEY || "";

export const YoutubeWizard: React.FC<PickerProps> = ({ dispatch, onClose }) => {
  const [urlFieldVal, setUrlFieldVal] = useState("");
  const [searchFieldVal, setSearchFieldVal] = useState("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const dispatchURL = useCallback(
    (url: string) => {
      dataManager.addCard({
        kind: "youtube",
        title: "video",
        icon: YoutubeIcon,
        uri: url,
        x: 0,
        y: 0,
        w: 300,
        h: 200,
        id: gordonId(),
        state: {
          playing: false,
          playedProgress: 0,
          playedSeconds: 0,
          volume: 1,
          muted: false,
        },
        author: dataManager.getMe().id,
        manager: dataManager.getMe().id,
        trashed: false,
      });
      onClose();
    },
    [onClose]
  );
  const onSubmitURL = useCallback(
    (e: any) => {
      e.preventDefault();
      if (urlFieldVal.match(regex)) {
        dispatchURL(urlFieldVal);
        setUrlFieldVal("");
      }
    },
    [dispatchURL, urlFieldVal]
  );
  const onSearch = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
            key: api_key,
            part: "snippet",
            q: searchFieldVal,
            type: "video",
            videoEmbeddable: "true",
            maxResults: "5",
          })}`,
          {
            method: "GET",
          }
        );
        const { items } = await res.json();
        setSearchResults(items);
      } catch (err) {
        console.log(err);
      }
    },
    [searchFieldVal]
  );
  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <div>
        <label>
          by URL
          <form onSubmit={onSubmitURL}>
            <input
              type="url"
              value={urlFieldVal}
              onChange={(e: React.ChangeEvent<any>) => {
                setUrlFieldVal(e.target.value);
              }}
              placeholder={"youtube url..."}
              pattern={regex}
            />
            <input type="submit" value="cast!" />
          </form>
        </label>
        <label>
          search
          <form onSubmit={onSearch}>
            <input
              type="text"
              value={searchFieldVal}
              onChange={(e: React.ChangeEvent<any>) => {
                setSearchFieldVal(e.target.value);
              }}
              autoFocus={true}
              placeholder={"search query..."}
            />
            <input type="submit" value="search!" />
          </form>
        </label>
      </div>
      <div
        style={{
          borderTop: "1px solid black",
          overflow: "auto",
          flexGrow: 1,
          marginTop: "10px",
          width: "100%",
        }}
      >
        <div>
          {searchResults.map((result: any) => (
            <div
              key={result.id.videoId}
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
                margin: "10px",
                padding: "10px",
                cursor: "pointer",
                maxWidth: "200px",
                display: "inline-block",
              }}
              onClick={() =>
                dispatchURL(`https://youtube.com/watch?v=${result.id.videoId}`)
              }
            >
              <h2 style={{ margin: 0, fontSize: "20px" }}>
                <img src={result.snippet.thumbnails.medium.url} width={200} />
                {result.snippet.title}
              </h2>
              <h3 style={{ margin: 0, color: "gray" }}>
                {result.snippet.channelTitle}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface YoutubeCardProps {
  card: YoutubeCard;
  dispatch: React.Dispatch<action>;
}

const YoutubeCardComponent: React.FC<YoutubeCardProps> = ({
  card,
  dispatch,
}) => {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(
    (player: ReactPlayer) => {
      const activePlayer = player.getInternalPlayer() as any;
      const video_data = activePlayer.getVideoData();
      const title = video_data.title;
      dataManager.updateCard({ ...card, title });
      setReady(true);
    },
    [card]
  );
  const playerRef = useRef<ReactPlayer>(null);

  const onSeek = useCallback((seconds: number) => {
    console.log(seconds, "seeked");
  }, []);

  const onProgress = useCallback(
    (prog: {
      played: number;
      playedSeconds: number;
      loaded: number;
      loadedSeconds: number;
    }) => {
      const state = {
        ...card.state,
        playedProgress: prog.played,
        playedSeconds: prog.playedSeconds,
      };
      dataManager.updateCard({ ...card, state });
    },
    [card]
  );
  const onPlay = useCallback(() => {
    const state = { ...card.state, playing: true };
    dataManager.updateCard({ ...card, state });
  }, [card]);
  const onPause = useCallback(() => {
    const state = { ...card.state, playing: false };
    dataManager.updateCard({ ...card, state });
  }, [card]);
  const onEnd = useCallback(() => {
    const state = {
      ...card.state,
      playing: false,
      playedProgress: 0,
      playedSeconds: 0,
    };
    dataManager.updateCard({ ...card, state });
  }, [card]);
  const togglePlay = useCallback(() => {
    const state = { ...card.state, playing: !card.state.playing };
    dataManager.updateCard({ ...card, state });
  }, [card]);
  useEffect(() => {
    if (playerRef.current && playerRef.current.getCurrentTime() !== null) {
      if (
        Math.abs(
          playerRef.current.getCurrentTime() - card.state.playedSeconds
        ) >= 1.0
      ) {
        console.log(`Out of sync: ${playerRef.current.getCurrentTime()}`, card);
        playerRef.current.seekTo(card.state.playedSeconds, "seconds");
      }
    }
  }, [card]);
  const { playedSeconds } = card.state;
  // https://github.com/alexanderwallin/react-player-controls/blob/master/src/components/FormattedTime.js
  const hours = Math.floor(playedSeconds / 3600).toString();
  const minutes = Math.floor((playedSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (Math.floor(playedSeconds) % 60).toString().padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: "auto",
        }}
      >
        <ReactPlayer
          url={card.uri}
          width={"100%"}
          height={"100%"}
          className="react-player"
          onReady={onReady}
          ref={playerRef}
          controls={false}
          // loop={true}
          playing={card.state.playing}
          volume={card.state.volume}
          muted={card.state.muted}
          onSeek={onSeek}
          onProgress={onProgress}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnd}
          progressInterval={500}
          config={{
            youtube: {
              playerVars: {
                modestBranding: 1,
                rel: 1,
                start: card.state.playedSeconds,
              },
            },
          }}
        />
        {!ready && <span>loading... (insert snail here)</span>}
      </div>
      <div
        style={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: "auto",
        }}
      >
        <span>
          {hours !== "0" && hours + ":"}
          {minutes}:{seconds}
        </span>
        <button onClick={togglePlay} disabled={!ready}>
          {card.state.playing ? "pause" : "play"}
        </button>
      </div>
    </div>
  );
};

export default YoutubeCardComponent;
