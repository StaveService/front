import React, { useEffect, useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import { MenuItem, Select } from "@material-ui/core";
import {
  HTMLMediaControls,
  HTMLMediaState,
} from "react-use/lib/factory/createHTMLMediaHook";
import ItunesPlayer from "./Itunes";
import SpotifyPlayer from "./Spotify";

type PlayerProps = {
  src: {
    itunes: string | undefined;
    spotify: string | undefined;
    [key: string]: string | undefined;
  };
};
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
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
  if (selectedSrcType === "itunes") {
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
  }
  if (selectedSrcType === "spotify") {
    return (
      <>
        {src.spotify && (
          <SpotifyPlayer
            src={src.spotify}
            selectInput={<SelectInput />}
            onMute={handleMute}
            onVolume={handleVolume}
            onPlay={handlePlay}
          />
        )}
        <Toolbar />
      </>
    );
  }
  return <></>;
};

export default Player;
