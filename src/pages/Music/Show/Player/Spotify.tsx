import React, { ChangeEvent } from "react";
import { useAudio } from "react-use";
import Toolbar from "@material-ui/core/Toolbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Box from "@material-ui/core/Box";
import {
  HTMLMediaControls,
  HTMLMediaState,
} from "react-use/lib/factory/createHTMLMediaHook";
import { useSelector } from "react-redux";
import SpotifyButton from "../../../../components/Button/Spotify";
import Volume from "../../../../ui/Volume";
import Pause from "../../../../ui/Pause";
import { selectSpotifyToken } from "../../../../slices/spotify";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
      color: "#191414",
    },
    spotify: {
      color: theme.palette.spotify.main,
    },
    colorPrimary: {
      background: theme.palette.spotify.light,
    },
    barColorPrimary: {
      backgroundColor: theme.palette.spotify.main,
    },
  })
);
interface PlayerProps {
  src: string;
  selectInput: React.ReactNode;
  onVolume: (newValue: number, controls: HTMLMediaControls) => void;
  onPlay: (state: HTMLMediaState, controls: HTMLMediaControls) => void;
  onMute: (state: HTMLMediaState, controls: HTMLMediaControls) => void;
}
const Player: React.FC<PlayerProps> = ({
  src,
  selectInput,
  onVolume,
  onPlay,
  onMute,
}: PlayerProps) => {
  const [audio, state, controls] = useAudio({
    src,
  });
  const spotifyToken = useSelector(selectSpotifyToken);
  const handleVolume = (
    _e: ChangeEvent<Record<string, unknown>>,
    newValue: number | number[]
  ) => {
    if (!Array.isArray(newValue)) onVolume(newValue, controls);
  };
  const handlePlay = () => onPlay(state, controls);
  const handleMute = () => onMute(state, controls);
  const classes = useStyles();
  return (
    <AppBar position="fixed" color="inherit" className={classes.appBar}>
      {audio}
      <LinearProgress
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
        variant="determinate"
        value={(state.time / state.duration) * 100}
      />
      <Toolbar>
        <Box width="100%">
          <Box display="flex" justifyContent="space-between">
            <ToggleButtonGroup>
              <Volume
                className={classes.spotify}
                muted={state.muted}
                volume={state.volume * 100}
                onVolume={handleVolume}
                onMute={handleMute}
              />
              <Pause
                className={classes.spotify}
                paused={state.paused}
                onPause={handlePlay}
                disabled={!spotifyToken}
              />
            </ToggleButtonGroup>
            {!spotifyToken && <SpotifyButton />}
            <Box display="flex" alignItems="center">
              {selectInput}
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Player;
