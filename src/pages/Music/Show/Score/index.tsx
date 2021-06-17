import React, { useCallback, useEffect, useRef, useState } from "react";
import useScript from "react-script-hook";
import { useSnackbar } from "notistack";
import { AlphaTabApi, model } from "@coderline/alphatab";
import Box from "@material-ui/core/Box";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";
import Header from "./Header";
import Tracks, { Track } from "../../../../ui/Tracks";
import { IAlphaTab, IMusicType } from "../../../../interfaces";
import styles from "./index.module.css";
import { useQuerySnackbar } from "../../../../hooks/useQuerySnackbar";
import queryKey from "../../../../constants/queryKey.json";
import { graphQLClient } from "../../../../gql/client";
import { musicQuery } from "../../../../gql/query/music";

const settings = {
  tex: true,
  player: {
    enablePlayer: true,
    soundFont:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
  },
};
const Score = new model.Score();
const Tab: React.FC = () => {
  const [tracks, setTracks] = useState<typeof Track[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [alphaTabApi, setAlphaTabApi] = useState<AlphaTabApi>();
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { onError } = useQuerySnackbar();
  const [loading, error] = useScript({
    src:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/alphaTab.js",
  });
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const onSuccess = (res: IMusicType) => alphaTabApi?.tex(res.music.tab);
  // react-query
  useQuery<IMusicType>(
    [queryKey.MUSIC, id],
    () => graphQLClient.request(musicQuery, { id }),
    { onSuccess, onError, enabled: loading }
  );
  // handlers
  const handleListItemClick = (track: typeof Track, i: number) => {
    setSelectedIndex(i);
    alphaTabApi?.renderTracks([track]);
  };
  const handleMute = (mute: boolean, track: typeof Track) =>
    alphaTabApi?.changeTrackMute([track], !mute);
  const handleSolo = (solo: boolean, track: typeof Track) =>
    alphaTabApi?.changeTrackSolo([track], !solo);
  const scoreLoaded = (score: typeof Score) => setTracks(score.tracks);
  const renderStarted = useCallback(() => {
    if (alphaTabApi) setSelectedIndex(alphaTabApi.tracks[0].index);
  }, [alphaTabApi]);
  // init alphaTabApi
  useEffect(() => {
    if (!loading && ref.current)
      setAlphaTabApi(new window.alphaTab.AlphaTabApi(ref.current, settings));
  }, [loading]);
  // mount
  useEffect(() => {
    alphaTabApi?.renderStarted.on(renderStarted);
    alphaTabApi?.scoreLoaded.on(scoreLoaded);
    return () => {
      alphaTabApi?.renderStarted.off(renderStarted);
      alphaTabApi?.scoreLoaded.off(scoreLoaded);
      alphaTabApi?.destroy();
    };
  }, [
    alphaTabApi,
    alphaTabApi?.renderStarted,
    alphaTabApi?.scoreLoaded,
    renderStarted,
  ]);
  // useScript handleError
  useEffect(() => {
    if (error) enqueueSnackbar(error.type, { variant: "error" });
  }, [enqueueSnackbar, error]);
  return (
    <Box
      className="at-wrap"
      position="relative"
      display="flex"
      flexDirection="column"
      height="93vh"
      overflow="hidden"
    >
      <Header alphaTabApi={alphaTabApi} />
      <Box
        className="at-content"
        position="relative"
        overflow="hidden"
        flexGrow={1}
      >
        <Box
          className={styles.atSidebar}
          position="absolute"
          top="0"
          left="0"
          bottom="0"
          zIndex={1001}
          display="flex"
          alignContent="stretch"
          width="auto"
          maxWidth="60px"
          overflow="hidden"
          border={1}
          borderLeft={0}
          borderTop={0}
          borderBottom={0}
          borderColor="divider"
        >
          <Tracks
            tracks={tracks}
            selectedIndex={selectedIndex}
            onMute={handleMute}
            onSolo={handleSolo}
            onListItemClick={handleListItemClick}
          />
        </Box>
        <Box
          className="at-viewport"
          overflow="auto"
          position="absolute"
          top={0}
          left={70}
          right={0}
          bottom={0}
          pr={3}
        >
          <div ref={ref} className="at-main" />
        </Box>
      </Box>
    </Box>
  );
};
declare global {
  interface Window {
    alphaTab: IAlphaTab;
    dispatchCode: (code: string) => void;
  }
}

export default Tab;
