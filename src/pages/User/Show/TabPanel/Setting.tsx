import React from "react";
import SpotifyIcon from "../../../../components/Icon/Spotify";
import LinkIconButton from "../../../../components/Button/Icon/Link";

const Setting: React.FC = () => {
  return (
    <div>
      <LinkIconButton>
        <SpotifyIcon />
      </LinkIconButton>
    </div>
  );
};
export default Setting;
