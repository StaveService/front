import React from "react";
import SpotifyIcon from "../../../../components/Icon/Spotify";
import LinkIconButton from "../../../../components/Button/Icon/Link";

const Setting: React.FC = () => {
  return (
    <div>
      <LinkIconButton
        href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${
          process.env.REACT_APP_SPOTIFY_KEY || ""
        }&redirect_uri=${encodeURIComponent("http://localhost:3001")}`}
        windowFeatures="top=100,left=100,width=500,height=700"
      >
        <SpotifyIcon />
      </LinkIconButton>
    </div>
  );
};
export default Setting;
