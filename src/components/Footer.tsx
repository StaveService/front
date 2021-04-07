import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
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
  if (value >= 60) return <VolumeUpIcon />;
  if (value >= 30) return <VolumeDownIcon />;
  return <VolumeMuteIcon />;
};
interface FooterProps {
  src?: string;
}
const Footer: React.FC<FooterProps> = ({ src }: FooterProps) => {
  if (!src) return null;
  const SLIDER_VALUE = 200;
  const [paused, setPaused] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState(SLIDER_VALUE);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [currentTime, setCurrentTime] = useState(0);
  const classes = useStyles();
  const handleEnded = () => setPaused(true);
  const handleClickValue = (e: MouseEvent<HTMLSpanElement, MouseEvent>) =>
    e.stopPropagation();

  const handleTimeUpdate = () =>
    audio && setCurrentTime((audio.currentTime / audio.duration) * 100);
  const handleChangeValue = (
    _e: ChangeEvent<Record<string, unknown>>,
    newValue: number | number[]
  ) => {
    if (Array.isArray(newValue)) return;
    setValue(newValue);
  };
  const handleChangeSelected = () => {
    setSelected(!selected);
    setDisabled(!disabled);
    if (audio) audio.muted = !disabled;
  };
  const handleClick = async () => {
    if (audio)
      if (paused) {
        await audio.play();
        setPaused(false);
      } else {
        audio.pause();
        setPaused(true);
      }
  };
  // set Audio
  useEffect(() => {
    if (src) setAudio(new Audio(src));
  }, [src]);
  // set Events
  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.pause();
        setAudio(undefined);
      }
    };
  }, [audio]);

  // update Volume
  useEffect(() => {
    if (audio) audio.volume = value / SLIDER_VALUE;
  }, [value]);

  return (
    <AppBar position="fixed" color="inherit" className={classes.appBar}>
      <LinearProgress variant="determinate" value={currentTime} />
      <Toolbar>
        <ToggleButton
          value=""
          selected={selected}
          onChange={handleChangeSelected}
        >
          <Box width={SLIDER_VALUE} display="flex" alignItems="center">
            <VolumeIcon value={value} muted={selected} />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Slider
              disabled={disabled}
              value={value}
              onClick={handleClickValue}
              onChange={handleChangeValue}
            />
          </Box>
        </ToggleButton>
        <ToggleButton value="" onClick={handleClick}>
          {paused ? <PlayArrowIcon /> : <PauseIcon />}
        </ToggleButton>
      </Toolbar>
    </AppBar>
  );
};

Footer.defaultProps = {
  src: undefined,
};

export default Footer;
