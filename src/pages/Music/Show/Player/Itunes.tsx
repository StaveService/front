import React, { ChangeEvent } from "react";
import { useAudio } from "react-use";
import Toolbar from "@material-ui/core/Toolbar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Box from "@material-ui/core/Box";
import {
  HTMLMediaControls,
  HTMLMediaState,
} from "react-use/lib/factory/createHTMLMediaHook";
import Volume from "../../../../ui/Volume";
import Pause from "../../../../ui/Pause";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
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
    src: src || "",
  });
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
    <>
      <AppBar position="fixed" color="inherit" className={classes.appBar}>
        {audio}
        <LinearProgress
          variant="determinate"
          value={(state.time / state.duration) * 100}
        />
        <Toolbar>
          <Box width="100%">
            <Box display="flex" justifyContent="space-between">
              <ToggleButtonGroup>
                <Volume
                  muted={state.muted}
                  volume={state.volume * 100}
                  onVolume={handleVolume}
                  onMute={handleMute}
                />
                <Pause paused={state.paused} onPause={handlePlay} />
              </ToggleButtonGroup>
              <Box display="flex" alignItems="center">
                {selectInput}
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Player;
