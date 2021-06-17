import React, { useEffect, useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { MenuItem, Select } from "@material-ui/core";
import {
  HTMLMediaControls,
  HTMLMediaState,
} from "react-use/lib/factory/createHTMLMediaHook";
import ItunesPlayer from "./Itunes";

const useStyles = makeStyles(() =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
    },
  })
);
interface PlayerProps {
  src: {
    itunes: string | undefined;
    [key: string]: string | undefined;
  };
}
const Player: React.FC<PlayerProps> = ({ src }: PlayerProps) => {
  const srcTypes = Object.entries(src)
    .filter(([, value]) => !!value)
    .map(([key]) => key);
  const [selectedSrcType, setSelectedSrcType] = useState("");
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) =>
    setSelectedSrcType(event.target.value as string);
  const handleMute = (state: HTMLMediaState, controls: HTMLMediaControls) =>
    state.muted ? controls.unmute() : controls.mute();
  const handlePlay = (state: HTMLMediaState, controls: HTMLMediaControls) =>
    state.paused ? controls.play() : controls.pause();
  const handleVolume = (
    newValue: number | number[],
    controls: HTMLMediaControls
  ) => {
    if (!Array.isArray(newValue)) controls.volume(newValue / 100);
  };
  useEffect(() => {
    setSelectedSrcType(srcTypes[0]);
  }, [srcTypes]);

  const SelectInput = () => (
    <Box display="flex" alignItems="center">
      <Select value={selectedSrcType} onChange={handleChange}>
        {srcTypes.map((srcType) => {
          return (
            <MenuItem key={srcType} value={srcType}>
              {srcType}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );

  return (
    <>
      {src.itunes && (
        <ItunesPlayer
          src={src.itunes}
          selectInput={<SelectInput />}
          onMute={handleMute}
          onVolume={handleVolume}
          onPlay={handlePlay}
        />
      )}
      <Toolbar />
    </>
  );
};

export default Player;
