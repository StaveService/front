import React, { ChangeEvent } from "react";
import { useAudio } from "react-use";
import Toolbar from "@material-ui/core/Toolbar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import LinearProgress from "@material-ui/core/LinearProgress";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Volume from "../../../ui/Volume";
import Pause from "../../../ui/Pause";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
    },
  })
);
interface FooterProps {
  src?: string;
}
const Footer: React.FC<FooterProps> = ({ src }: FooterProps) => {
  const [audio, state, controls] = useAudio({
    src: src || "",
  });
  const classes = useStyles();
  const handleMute = () => (state.muted ? controls.unmute() : controls.mute());
  const handleClick = () => (state.paused ? controls.play() : controls.pause());
  const handleVolume = (
    _e: ChangeEvent<Record<string, unknown>>,
    newValue: number | number[]
  ) => {
    if (!Array.isArray(newValue)) controls.volume(newValue / 100);
  };
  if (!src) return null;
  return (
    <>
      <AppBar position="fixed" color="inherit" className={classes.appBar}>
        {audio}
        <LinearProgress
          variant="determinate"
          value={(state.time / state.duration) * 100}
        />
        <Toolbar>
          <ToggleButtonGroup>
            <Volume
              muted={state.muted}
              volume={state.volume * 100}
              onVolume={handleVolume}
              onMute={handleMute}
            />
            <Pause paused={state.paused} onPause={handleClick} />
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

Footer.defaultProps = {
  src: undefined,
};

export default Footer;
