import React from "react";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import SpotifyIcon from "../Icon/Spotify";

const Spotify: React.FC = () => {
  const handleClick = () => {
    window.open(
      `https://accounts.spotify.com/authorize?response_type=code&client_id=${
        process.env.REACT_APP_SPOTIFY_KEY || ""
      }&redirect_uri=${encodeURIComponent(
        window.location.origin
      )}&scope=${encodeURIComponent("user-read-email")}`,
      undefined,
      "top=100,left=100,width=500,height=700"
    );
  };
  return (
    <Button
      startIcon={<SpotifyIcon />}
      component={Link}
      onClick={handleClick}
      rel="noopener noreferrer"
    >
      Sign in Spotify
    </Button>
  );
};
export default Spotify;
