import React, { useEffect, useRef, useState } from "react";
import useScript from "react-script-hook";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AlphaTabApi } from "@coderline/alphatab";
import Box from "@material-ui/core/Box";
import Header from "./Header";
import Tracks, { Track } from "../../../../ui/Tracks";
import { IAlphaTab } from "../../../../interfaces";
import styles from "./index.module.css";

const settings = {
  file: "https://www.alphatab.net/files/canon.gp",
  player: {
    enablePlayer: true,
    soundFont:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
  },
};
const Tab: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [alphaTabApi, setAlphaTabApi] = useState<AlphaTabApi>();
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, error] = useScript({
    src:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/alphaTab.js",
  });
  // handlers
  const handleListItemClick = (track: Track, i: number) => {
    setSelectedIndex(i);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    alphaTabApi?.renderTracks([track]);
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const scoreLoaded = (score: any) => setTracks(score.tracks);
  const renderStarted = () => {
    if (alphaTabApi) setSelectedIndex(alphaTabApi?.tracks[0].index);
  };
  // useScript handleError
  useEffect(() => {
    if (error) enqueueSnackbar(error.type, { variant: "error" });
  }, [error]);
  // init alphaTab
  useEffect(() => {
    if (!loading && ref.current)
      setAlphaTabApi(new window.alphaTab.AlphaTabApi(ref.current, settings));
    return () => {
      alphaTabApi?.destroy();
    };
  }, [loading]);
  // mount
  useEffect(() => {
    alphaTabApi?.renderStarted.on(renderStarted);
    alphaTabApi?.scoreLoaded.on(scoreLoaded);
    return () => {
      alphaTabApi?.renderStarted.off(renderStarted);
      alphaTabApi?.scoreLoaded.off(scoreLoaded);
    };
  }, [alphaTabApi]);
  if (loading) return <CircularProgress />;
  return (
    <Box
      className="at-wrap"
      position="relative"
      display="flex"
      flexDirection="column"
      height="80vh"
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
  }
}

export default Tab;
