import React, { useEffect, useRef, useState } from "react";
import useScript from "react-script-hook";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AlphaTabApi, synth } from "@coderline/alphatab";
import Header from "./Header";

const settings = {
  file: "https://www.alphatab.net/files/canon.gp",
  player: {
    enablePlayer: true,
    soundFont:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
  },
};
const Tab: React.FC = () => {
  const [alphaTabApi, setAlphaTabApi] = useState<AlphaTabApi>();
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, error] = useScript({
    src:
      "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/alphaTab.js",
  });
  // useScript handleError
  useEffect(() => {
    if (error) enqueueSnackbar(error.type, { variant: "error" });
  }, [error]);
  // init alphaTab
  useEffect(() => {
    if (!loading && ref.current) {
      const { alphaTab } = window;
      setAlphaTabApi(new alphaTab.AlphaTabApi(ref.current, settings));
    }
  }, [loading]);
  if (loading) return <CircularProgress />;
  return (
    <div className="atWrap">
      <Header alphaTabApi={alphaTabApi} />
      <div className="atContent">
        <div className="atSidebar">Track selector will go here</div>
        <div className="atViewport">
          <div ref={ref} className="atMain" />
        </div>
      </div>
      <div className="atControls">Player controls will go here</div>
    </div>
  );
};
declare global {
  interface Window {
    alphaTab: {
      AlphaTabApi: typeof AlphaTabApi;
      synth: typeof synth;
    };
  }
}

export default Tab;
