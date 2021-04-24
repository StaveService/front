import React, { ChangeEvent, useEffect, useState } from "react";
import { useToggle } from "react-use";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { AlphaTabApi } from "@coderline/alphatab";
import SongInfo from "../../../../ui/SongInfo";
import Volume from "../../../../ui/Volume";
import Pause from "../../../../ui/Pause";
import Stop from "../../../../ui/Stop";
import CountIn from "../../../../ui/CountIn";
import Loop from "../../../../ui/Loop";
import Metronome from "../../../../ui/Metronome";

interface HeaderProps {
  alphaTabApi?: AlphaTabApi;
}
const Header: React.FC<HeaderProps> = ({ alphaTabApi }: HeaderProps) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [masterVolume, setMasterVolume] = useState(100);
  const [paused, setPaused] = useState(true);
  const [playerReady, setPlayerReady] = useState(true);
  const [muted, toggleMuted] = useToggle(false);
  const [countIn, toggleCountIn] = useToggle(false);
  const [loop, toggleLoop] = useToggle(false);
  const [metronome, toggleMetronome] = useToggle(false);
  // handlers
  const handlePlayerReadySetFalse = () => setPlayerReady(false);
  const handlePause = () => alphaTabApi?.playPause();
  const handleStop = () => alphaTabApi?.stop();
  const handleVolume = (
    _e: ChangeEvent<Record<string, unknown>>,
    newValue: number | number[]
  ) => {
    if (!alphaTabApi) return;
    if (!Array.isArray(newValue)) {
      alphaTabApi.masterVolume = newValue / 100;
      setMasterVolume(newValue);
    }
  };
  const handleMute = () => {
    if (!alphaTabApi) return;
    toggleMuted();
    if (alphaTabApi.masterVolume === 0) {
      alphaTabApi.masterVolume = masterVolume / 100;
    } else {
      alphaTabApi.masterVolume = 0;
    }
  };
  const handlePlayerState = ({ stopped }: { stopped: boolean }) =>
    setPaused(stopped);
  const handleCountIn = () => {
    if (!alphaTabApi) return;
    toggleCountIn();
    alphaTabApi.countInVolume = !countIn ? 1 : 0;
  };
  const handleLoop = () => {
    if (!alphaTabApi) return;
    toggleLoop();
    alphaTabApi.isLooping = !loop;
  };
  const handleMetronome = () => {
    if (!alphaTabApi) return;
    toggleMetronome();
    alphaTabApi.metronomeVolume = !metronome ? 1 : 0;
  };
  const scoreLoaded = (score: { title: string; artist: string }) => {
    setTitle(score.title);
    setArtist(score.artist);
  };
  useEffect(() => {
    alphaTabApi?.scoreLoaded.on(scoreLoaded);
    alphaTabApi?.playerReady.on(handlePlayerReadySetFalse);
    alphaTabApi?.playerStateChanged.on(handlePlayerState);
    return () => {
      alphaTabApi?.scoreLoaded.off(scoreLoaded);
      alphaTabApi?.playerReady.off(handlePlayerReadySetFalse);
      alphaTabApi?.playerStateChanged.off(handlePlayerState);
    };
  }, [alphaTabApi]);
  return (
    <AppBar className="Header" position="fixed" color="default">
      <Toolbar>
        <Grid container>
          <Grid className="at-controls-left" item xs={4}>
            <SongInfo title={title} artist={artist} />
          </Grid>
          <Grid item xs={5}>
            <Box display="flex" justifyContent="center">
              <ToggleButtonGroup>
                <Stop onStop={handleStop} />
                <Pause
                  paused={paused}
                  disabled={playerReady}
                  onPause={handlePause}
                />
                <Volume
                  volume={masterVolume}
                  muted={muted}
                  onMute={handleMute}
                  onVolume={handleVolume}
                />
                <CountIn selected={countIn} onClick={handleCountIn} />
                <Loop selected={loop} onClick={handleLoop} />
                <Metronome selected={metronome} onClick={handleMetronome} />
              </ToggleButtonGroup>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Grid className="at-controls-right" container>
              <Grid item xs={6} />
              <Grid item xs={3}>
                {/* <ZoomSelect /> */}
              </Grid>
              <Grid item xs={3}>
                {/* <LayoutSelect /> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
Header.defaultProps = {
  alphaTabApi: undefined,
};

export default Header;
