import axios from "axios";

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  // params: {
  // apikey: process.env.REACT_APP_SPOTIFY_KEY,
  // },
});

export default undefined;
