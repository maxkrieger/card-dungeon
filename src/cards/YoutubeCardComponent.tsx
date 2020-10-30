import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { AbstractCard, action, gordonId } from "../DataManager";
import YoutubeIcon from "../assets/youtube.png";
import { dataManager } from "../App";
import YoutubeCardIcon from "../assets/youtubeimages/youtube_0000.png";
import { PickerProps, CardPickerData } from "../CardPicker";
import PauseIcon from "../assets/pause.png";
import PlayIcon from "../assets/play.png";
import { FormattedTime } from "react-player-controls";
import styled from "styled-components";
import playhead from "../assets/playhead.png";
import SubmitButton from "../assets/submit-button.png";

import {
  SliderInput,
  SliderTrack,
  SliderTrackHighlight,
  SliderHandle,
  SliderMarker,
} from "@reach/slider";
import "@reach/slider/styles.css";
import { BORDER_PRIMARY_COLOR } from "../colors";
import TextInputForm from "../TextInputForm";

const SliderWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
  [data-reach-slider-input] {
    width: 100%;
    padding: 0;
  }
  [data-reach-slider-track] {
    height: 10px;
  }
  [data-reach-slider-track-highlight] {
    background-color: green;
  }
  [data-reach-slider-handle] {
    background: url(${playhead});
    background-size: cover;
    width: 15px;
    height: 15px;
  }
`;

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

export const YoutubeCardPicker: React.FC<PickerProps> = ({
  dispatch,
  onClose,
}) => {
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
        w: 330,
        h: 220,
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

  const onSearch = useCallback(async (searchFieldVal: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
          key: api_key,
          part: "snippet",
          q: searchFieldVal,
          type: "video",
          videoEmbeddable: "true",
          maxResults: "6",
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
  }, []);
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Alagard",
      }}
    >
      <div>
        <TextInputForm
          onSubmit={dispatchURL}
          regex={regex}
          maxLength={50}
          placeholder="youtube URL"
        />
        <hr style={{ borderColor: BORDER_PRIMARY_COLOR }} />
        <TextInputForm
          onSubmit={onSearch}
          maxLength={800}
          regex={null}
          placeholder="search youtube"
          keepOnSubmit={true}
        />
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
                backgroundColor: "rgba(0,0,0,0.4)",
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
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color: BORDER_PRIMARY_COLOR,
                }}
              >
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

export const YoutubeCardData: CardPickerData = {
  icon: YoutubeCardIcon,
  picker: YoutubeCardPicker,
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
  const myID = dataManager.getMe().id;

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
      if (myID === card.manager) {
        const state = {
          ...card.state,
          playedProgress: prog.played,
          playedSeconds: prog.playedSeconds,
        };
        dataManager.updateCard({ ...card, state });
      }
    },
    [card, myID]
  );
  const onPlay = useCallback(() => {
    if (!card.state.playing) {
      const state = { ...card.state, playing: true };
      dataManager.updateCard({ ...card, state });
    }
  }, [card]);
  const onPause = useCallback(() => {
    if (card.state.playing) {
      const state = { ...card.state, playing: false };
      dataManager.updateCard({ ...card, state });
    }
  }, [card]);
  const seekTo = useCallback(
    (value: number) => {
      if (playerRef.current) {
        const duration = playerRef.current.getDuration();
        const state = {
          ...card.state,
          playing: true,
          playedProgress: value,
          playedSeconds: value * duration,
        };
        dataManager.updateCard({ ...card, state });
      }
    },
    [card]
  );
  const onEnd = useCallback(() => {
    if (card.state.playedProgress !== 0) {
      const state = {
        ...card.state,
        playing: false,
        playedProgress: 0,
        playedSeconds: 0,
      };
      dataManager.updateCard({ ...card, state });
    }
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        userSelect: "none",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: "auto",
        }}
        onClick={togglePlay}
      >
        <ReactPlayer
          url={card.uri}
          width={"100%"}
          height={"100%"}
          className="react-player"
          onReady={onReady}
          ref={playerRef}
          controls={false}
          style={{ pointerEvents: "none" }}
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
          minHeight: "50px",
        }}
      >
        <div style={{ width: "100%" }}>
          <SliderWrapper>
            <SliderInput
              min={0}
              max={1}
              step={0.01}
              value={card.state.playedProgress}
              onChange={seekTo}
            >
              <SliderTrack>
                <SliderTrackHighlight />
                <SliderHandle />
              </SliderTrack>
            </SliderInput>
          </SliderWrapper>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <span
            style={{ fontFamily: `"Alagard"`, color: BORDER_PRIMARY_COLOR }}
          >
            <FormattedTime numSeconds={playedSeconds} />
          </span>
          <button
            onClick={togglePlay}
            disabled={!ready}
            style={{
              backgroundImage: `url(${
                card.state.playing ? PauseIcon : PlayIcon
              })`,
              backgroundColor: "transparent",
              width: "30px",
              height: "24px",
              backgroundSize: "cover",
              border: "none",
              outline: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default YoutubeCardComponent;
