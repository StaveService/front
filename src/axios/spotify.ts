import axios from "axios";

const { REACT_APP_SPOTIFY_KEY, REACT_APP_SPOTIFY_SECRET_KEY } = process.env;
const authorization: string = btoa(
  `${REACT_APP_SPOTIFY_KEY || ""}:${REACT_APP_SPOTIFY_SECRET_KEY || ""}`
);

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});
export const spotifyAccount = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
