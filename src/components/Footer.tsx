import React, { ChangeEvent, MouseEvent } from "react";
import { useAudio } from "react-use";
import Toolbar from "@material-ui/core/Toolbar";
import ToggleButton from "@material-ui/lab/ToggleButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Slider from "@material-ui/core/Slider";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
    },
  })
);
interface VolumeIconProps {
  value: number;
  muted: boolean;
}
const VolumeIcon: React.FC<VolumeIconProps> = ({
  value,
  muted,
}: VolumeIconProps) => {
  if (muted) return <VolumeOffIcon />;
  if (value >= 0.6) return <VolumeUpIcon />;
  if (value >= 0.3) return <VolumeDownIcon />;
  return <VolumeMuteIcon />;
};
interface FooterProps {
  src?: string;
}
const Footer: React.FC<FooterProps> = ({ src }: FooterProps) => {
  if (!src) return null;
  const [audio, state, controls] = useAudio({
    src,
  });
  const classes = useStyles();
  const handleChangeSelected = () =>
    state.muted ? controls.unmute() : controls.mute();
  const handleClick = async () =>
    state.paused ? controls.play() : controls.pause();
  const handleClickValue = (e: MouseEvent<HTMLSpanElement, MouseEvent>) =>
    e.stopPropagation();
  const handleVolume = (
    _e: ChangeEvent<Record<string, unknown>>,
    newValue: number | number[]
  ) => {
    if (!Array.isArray(newValue)) controls.volume(newValue / 100);
  };
  return (
    <AppBar position="fixed" color="inherit" className={classes.appBar}>
      {audio}
      <LinearProgress
        variant="determinate"
        value={(state.time / state.duration) * 100}
      />
      <Toolbar>
        <ToggleButton
          value=""
          selected={state.muted}
          onChange={handleChangeSelected}
        >
          <Box width={200} display="flex" alignItems="center">
            <VolumeIcon value={state.volume} muted={state.muted} />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Slider
              disabled={state.muted}
              value={state.volume * 100}
              onClick={handleClickValue}
              onChange={handleVolume}
            />
          </Box>
        </ToggleButton>
        <ToggleButton value="" onClick={handleClick}>
          {state.paused ? <PlayArrowIcon /> : <PauseIcon />}
        </ToggleButton>
      </Toolbar>
    </AppBar>
  );
};

Footer.defaultProps = {
  src: undefined,
};

export default Footer;
